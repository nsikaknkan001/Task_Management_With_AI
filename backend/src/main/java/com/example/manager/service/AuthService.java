package com.example.manager.service;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.manager.dto.AuthResponse;
import com.example.manager.dto.LoginRequest;
import com.example.manager.dto.RegisterRequest;
import com.example.manager.dto.ResendCodeRequest;
import com.example.manager.dto.UserResponse;
import com.example.manager.dto.VerifyEmailRequest;
import com.example.manager.entity.User;
import com.example.manager.repository.UserRepository;
import com.example.manager.security.JwtTokenUtil;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserDetailsServiceImpl userDetailsService;

    @Autowired
    private JwtTokenUtil jwtTokenUtil;

    @Autowired
    private EmailService emailService;

    public AuthResponse login(LoginRequest loginRequest) {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword()));
        } catch (BadCredentialsException e) {
            throw new BadCredentialsException("Invalid Username or Password", e);
        }

        final UserDetails userDetails = userDetailsService.loadUserByUsername(loginRequest.getEmail());
        final String token = jwtTokenUtil.generateToken(userDetails);

        User user = userRepository.findByEmail(loginRequest.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!user.isVerified()) {
            throw new RuntimeException("Please verify your email before logging in");
        }


        return new AuthResponse(new UserResponse(user), token);
    }

    @Transactional
    public AuthResponse register(RegisterRequest registerRequest) {
        // Check if there's a verified user with this email
        Optional<User> existingUser = userRepository.findByEmail(registerRequest.getEmail());
        if (existingUser.isPresent() && existingUser.get().isVerified()) {
            throw new RuntimeException("Email is already registered and verified!");
        }

        // Check if there's a verified user with this username
        Optional<User> existingUsernameUser = userRepository.findByUsername(registerRequest.getUsername());
        if (existingUsernameUser.isPresent() && existingUsernameUser.get().isVerified()) {
            throw new RuntimeException("Username is already taken!");
        }

        // Clean up any existing incomplete registration for this email or username
        if (existingUser.isPresent() && !existingUser.get().isVerified()) {
            userRepository.delete(existingUser.get());
            System.out.println("🧹 Cleaned up incomplete registration for email: " + registerRequest.getEmail());
        }
        
        // Also clean up any unverified user with the same username
        if (existingUsernameUser.isPresent() && !existingUsernameUser.get().isVerified()) {
            userRepository.delete(existingUsernameUser.get());
            System.out.println("🧹 Cleaned up incomplete registration for username: " + registerRequest.getUsername());
        }

        // Create new user with pending verification status
        User user = new User();
        user.setUsername(registerRequest.getUsername());
        user.setEmail(registerRequest.getEmail());
        user.setPassword(passwordEncoder.encode(registerRequest.getPassword()));
        user.setVerified(false);
        user.setPendingVerification(true); // Mark as pending verification
        
        // Generate verification code
        String verificationCode = generateVerificationCode();
        user.setVerificationCode(verificationCode);
        user.setVerificationCodeExpiry(LocalDateTime.now().plusMinutes(10));

        User savedUser = userRepository.save(user);

        // Send verification email
        try {
            emailService.sendVerificationEmail(savedUser.getEmail(), verificationCode, savedUser.getUsername());
            System.out.println("✅ Verification email sent successfully to: " + savedUser.getEmail());
        } catch (Exception e) {
            // If email fails, still return success but log the error
            System.err.println("❌ Failed to send verification email: " + e.getMessage());
            System.out.println("=== EMAIL FAILED - VERIFICATION CODE FOR TESTING ===");
            System.out.println("Email: " + savedUser.getEmail());
            System.out.println("Verification Code: " + verificationCode);
            System.out.println("====================================================");
        }

        // Return response without token (user needs to verify first)
        Map<String, String> response = new HashMap<>();
        return new AuthResponse(new UserResponse(savedUser), "VERIFICATION_REQUIRED");
    }

    @Transactional
    public AuthResponse verifyEmail(VerifyEmailRequest verifyRequest) {
        // Find user by email (whether pending or not)
        User user = userRepository.findByEmail(verifyRequest.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (user.isVerified()) {
            throw new RuntimeException("Email is already verified");
        }

        if (user.getVerificationCode() == null || 
            !user.getVerificationCode().equals(verifyRequest.getVerificationCode())) {
            throw new RuntimeException("Invalid verification code");
        }

        if (user.getVerificationCodeExpiry().isBefore(LocalDateTime.now())) {
            // Auto-cleanup expired verification
            userRepository.delete(user);
            throw new RuntimeException("Verification code has expired");
        }

        // Mark user as verified
        user.setVerified(true);
        user.setPendingVerification(false); // Remove pending status
        user.setVerificationCode(null);
        user.setVerificationCodeExpiry(null);
        User savedUser = userRepository.save(user);

        // Generate JWT token
        final UserDetails userDetails = userDetailsService.loadUserByUsername(savedUser.getEmail());
        final String token = jwtTokenUtil.generateToken(userDetails);

        return new AuthResponse(new UserResponse(savedUser), token);
    }

    @Transactional
    public void resendVerificationCode(ResendCodeRequest resendRequest) {
        // Find user by email
        User user = userRepository.findByEmail(resendRequest.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (user.isVerified()) {
            throw new RuntimeException("Email is already verified");
        }

        // Generate new verification code
        String verificationCode = generateVerificationCode();
        user.setVerificationCode(verificationCode);
        user.setVerificationCodeExpiry(LocalDateTime.now().plusMinutes(10));
        userRepository.save(user);

        // Send verification email
        emailService.sendVerificationEmail(user.getEmail(), verificationCode, user.getUsername());
    }

    private String generateVerificationCode() {
        SecureRandom random = new SecureRandom();
        int code = 1000 + random.nextInt(9000); // Generate 4-digit code
        return String.valueOf(code);
    }
}