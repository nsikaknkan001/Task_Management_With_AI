package com.example.manager.controller;

import java.util.HashMap;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.manager.dto.AuthResponse;
import com.example.manager.dto.LoginRequest;
import com.example.manager.dto.RegisterRequest;
import com.example.manager.dto.ResendCodeRequest;
import com.example.manager.dto.VerifyEmailRequest;
import com.example.manager.service.AuthService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*", maxAge = 3600)
public class AuthController {

    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);

    @Autowired
    private AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest loginRequest, BindingResult bindingResult) {
        logger.info("Login attempt for email: {}", loginRequest.getEmail());
        
        if (bindingResult.hasErrors()) {
            Map<String, String> errors = new HashMap<>();
            bindingResult.getFieldErrors().forEach(error -> 
                errors.put(error.getField(), error.getDefaultMessage())
            );
            logger.warn("Login validation errors: {}", errors);
            return ResponseEntity.badRequest().body(new ErrorResponse("Validation failed", errors));
        }
        
        try {
            AuthResponse authResponse = authService.login(loginRequest);
            logger.info("Login successful for email: {}", loginRequest.getEmail());
            return ResponseEntity.ok(authResponse);
        } catch (Exception e) {
            logger.error("Login failed for email: {}", loginRequest.getEmail(), e);
            return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest registerRequest, BindingResult bindingResult) {
        logger.info("Registration attempt for email: {} and username: {}", 
                   registerRequest.getEmail(), registerRequest.getUsername());
        
        if (bindingResult.hasErrors()) {
            Map<String, String> errors = new HashMap<>();
            bindingResult.getFieldErrors().forEach(error -> 
                errors.put(error.getField(), error.getDefaultMessage())
            );
            logger.warn("Registration validation errors: {}", errors);
            return ResponseEntity.badRequest().body(new ErrorResponse("Validation failed", errors));
        }
        
        try {
            AuthResponse authResponse = authService.register(registerRequest);
            logger.info("Registration successful for email: {}", registerRequest.getEmail());
            return ResponseEntity.ok(authResponse);
        } catch (Exception e) {
            logger.error("Registration failed for email: {}", registerRequest.getEmail(), e);
            return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
        }
    }

    @PostMapping("/verify-email")
    public ResponseEntity<?> verifyEmail(@Valid @RequestBody VerifyEmailRequest verifyRequest, BindingResult bindingResult) {
        logger.info("Email verification attempt for: {}", verifyRequest.getEmail());
        
        if (bindingResult.hasErrors()) {
            Map<String, String> errors = new HashMap<>();
            bindingResult.getFieldErrors().forEach(error -> 
                errors.put(error.getField(), error.getDefaultMessage())
            );
            logger.warn("Email verification validation errors: {}", errors);
            return ResponseEntity.badRequest().body(new ErrorResponse("Validation failed", errors));
        }
        
        try {
            AuthResponse authResponse = authService.verifyEmail(verifyRequest);
            logger.info("Email verification successful for: {}", verifyRequest.getEmail());
            return ResponseEntity.ok(authResponse);
        } catch (Exception e) {
            logger.error("Email verification failed for: {}", verifyRequest.getEmail(), e);
            return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
        }
    }

    @PostMapping("/resend-code")
    public ResponseEntity<?> resendVerificationCode(@Valid @RequestBody ResendCodeRequest resendRequest, BindingResult bindingResult) {
        logger.info("Resend verification code request for: {}", resendRequest.getEmail());
        
        if (bindingResult.hasErrors()) {
            Map<String, String> errors = new HashMap<>();
            bindingResult.getFieldErrors().forEach(error -> 
                errors.put(error.getField(), error.getDefaultMessage())
            );
            logger.warn("Resend code validation errors: {}", errors);
            return ResponseEntity.badRequest().body(new ErrorResponse("Validation failed", errors));
        }
        
        try {
            authService.resendVerificationCode(resendRequest);
            logger.info("Verification code resent successfully for: {}", resendRequest.getEmail());
            return ResponseEntity.ok(new SuccessResponse("Verification code sent successfully"));
        } catch (Exception e) {
            logger.error("Failed to resend verification code for: {}", resendRequest.getEmail(), e);
            return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
        }
    }

    private static class SuccessResponse {
        private String message;

        public SuccessResponse(String message) {
            this.message = message;
        }

        public String getMessage() {
            return message;
        }

        public void setMessage(String message) {
            this.message = message;
        }
    }

    private static class ErrorResponse {
        private String message;
        private Map<String, String> errors;

        public ErrorResponse(String message) {
            this.message = message;
        }
        
        public ErrorResponse(String message, Map<String, String> errors) {
            this.message = message;
            this.errors = errors;
        }

        public String getMessage() {
            return message;
        }

        public void setMessage(String message) {
            this.message = message;
        }
        
        public Map<String, String> getErrors() {
            return errors;
        }

        public void setErrors(Map<String, String> errors) {
            this.errors = errors;
        }
    }
}