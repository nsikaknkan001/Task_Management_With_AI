package com.example.manager.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import com.example.manager.entity.User;
import com.example.manager.repository.UserRepository;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    @Autowired
    private UserRepository userRepository;

    @Value("${spring.mail.username}")
    private String fromEmail;

    public void sendVerificationEmail(String toEmail, String verificationCode, String username) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(toEmail);
            message.setSubject("TaskManager Pro - Verify Your Email");
            message.setText(buildVerificationEmailBody(username, verificationCode));
            
            mailSender.send(message);
            System.out.println("✅ Verification email sent successfully to: " + toEmail);
        } catch (Exception e) {
            System.err.println("❌ Failed to send verification email to " + toEmail + ": " + e.getMessage());
            // Fallback to console output
            System.out.println("=== EMAIL FALLBACK - VERIFICATION ===");
            System.out.println("To: " + toEmail);
            System.out.println("Username: " + username);
            System.out.println("Verification Code: " + verificationCode);
            System.out.println("=====================================");
        }
    }

    private String buildVerificationEmailBody(String username, String verificationCode) {
        return String.format(
            "🎉 Welcome to TaskManager Pro, %s!\n\n" +
            "Thank you for joining TaskManager Pro - your ultimate task management solution!\n\n" +
            "📧 EMAIL VERIFICATION REQUIRED\n" +
            "To complete your registration, please use this verification code:\n\n" +
            "🔐 VERIFICATION CODE: %s\n\n" +
            "⏰ This code will expire in 10 minutes for security purposes.\n\n" +
            "Once verified, you'll be able to:\n" +
            "✅ Create and manage your tasks\n" +
            "✅ Set priorities and due dates\n" +
            "✅ Track your productivity\n\n" +
            "If you didn't create this account, please ignore this email.\n\n" +
            "Happy task managing! 🚀\n\n" +
            "Best regards,\n" +
            "The TaskManager Pro Team\n" +
            "taskmanagerai@gmail.com",
            username, verificationCode
        );
    }

    public void sendTaskReminder(String taskTitle, String taskDescription, String dueDate, Integer hoursUntilDue) {
        // Get current user email from security context
        String userEmail = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(userEmail).orElse(null);
        
        if (user == null) {
            System.err.println("❌ User not found for task reminder: " + userEmail);
            return;
        }

        sendTaskReminderToUser(userEmail, user.getUsername(), taskTitle, taskDescription, dueDate, hoursUntilDue);
    }

    // Method to send task reminder to specific user email
    public void sendTaskReminderToUser(String userEmail, String username, String taskTitle, String taskDescription, String dueDate, Integer hoursUntilDue) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(userEmail);
            message.setSubject("⏰ URGENT: Task Reminder - " + taskTitle);
            message.setText(buildTaskReminderEmailBody(username, taskTitle, taskDescription, dueDate, hoursUntilDue));
            
            mailSender.send(message);
            System.out.println("✅ Task reminder email sent successfully to: " + userEmail + " for task: " + taskTitle);
        } catch (Exception e) {
            System.err.println("❌ Failed to send task reminder email to " + userEmail + ": " + e.getMessage());
            // Fallback to console output
            System.out.println("=== EMAIL FALLBACK - TASK REMINDER ===");
            System.out.println("To: " + userEmail);
            System.out.println("User: " + username);
            System.out.println("Task: " + taskTitle);
            System.out.println("Due in: " + hoursUntilDue + " hours");
            System.out.println("Due Date: " + dueDate);
            System.out.println("Description: " + taskDescription);
            System.out.println("=====================================");
        }
    }

    private String buildTaskReminderEmailBody(String username, String taskTitle, String taskDescription, String dueDate, Integer hoursUntilDue) {
        String urgencyLevel = hoursUntilDue <= 1 ? "🚨 CRITICAL" : hoursUntilDue <= 6 ? "⚠️ URGENT" : "📋 REMINDER";
        
        return String.format(
            "%s - Task Deadline Approaching!\n\n" +
            "Hello %s,\n\n" +
            "⏰ IMPORTANT: Your task deadline is approaching!\n\n" +
            "📋 TASK DETAILS:\n" +
            "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n" +
            "📌 Title: %s\n" +
            "📝 Description: %s\n" +
            "📅 Due Date: %s\n" +
            "⏰ Time Remaining: %d hour(s)\n" +
            "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n" +
            "%s\n\n" +
            "🎯 ACTION REQUIRED:\n" +
            "Please complete this task before the deadline to stay on track!\n\n" +
            "💡 TIP: Log into TaskManager Pro to:\n" +
            "• Mark the task as completed\n" +
            "• Update the task details\n" +
            "• Set a new deadline if needed\n\n" +
            "Stay productive and achieve your goals! 💪\n\n" +
            "Best regards,\n" +
            "The TaskManager Pro Team\n" +
            "📧 taskmanagerai@gmail.com\n" +
            "🌐 TaskManager Pro - AI-Powered Task Management",
            urgencyLevel, username, taskTitle, taskDescription, dueDate, hoursUntilDue,
            hoursUntilDue <= 1 ? "🚨 This task is due in less than 1 hour!" :
            hoursUntilDue <= 6 ? "⚠️ This task is due very soon!" :
            "📅 Don't forget about this upcoming deadline!"
        );
    }
}