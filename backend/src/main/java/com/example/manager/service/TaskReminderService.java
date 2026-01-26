package com.example.manager.service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import com.example.manager.entity.Task;
import com.example.manager.entity.User;
import com.example.manager.repository.TaskRepository;
import com.example.manager.repository.UserRepository;

@Service
public class TaskReminderService {

    private static final Logger logger = LoggerFactory.getLogger(TaskReminderService.class);

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EmailService emailService;

    // Run every 5 minutes to check for tasks due within 24 hours
    @Scheduled(fixedRate = 300000) // 5 minutes = 300000 milliseconds
    public void checkTasksForReminders() {
        logger.info("🔍 Checking tasks for reminder notifications...");
        
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime twentyFourHoursFromNow = now.plusHours(24);
        
        // Find tasks that are due within 24 hours and haven't had reminders sent
        List<Task> tasksDueSoon = taskRepository.findTasksDueWithin24Hours(now, twentyFourHoursFromNow);
        
        logger.info("📋 Found {} tasks due within 24 hours", tasksDueSoon.size());
        
        int emailsSent = 0;
        for (Task task : tasksDueSoon) {
            if (!task.isReminderSent() && task.getDueDate() != null) {
                long hoursUntilDue = ChronoUnit.HOURS.between(now, task.getDueDate());
                
                if (hoursUntilDue <= 24 && hoursUntilDue > 0) {
                    boolean emailSent = sendTaskReminderEmail(task, hoursUntilDue);
                    
                    if (emailSent) {
                        // Mark reminder as sent
                        task.setReminderSent(true);
                        taskRepository.save(task);
                        emailsSent++;
                        
                        logger.info("✅ Reminder sent for task: {} (Due in {} hours)", task.getTitle(), hoursUntilDue);
                    }
                }
            }
        }
        
        if (tasksDueSoon.isEmpty()) {
            logger.info("ℹ️ No tasks found that need reminders at this time");
        } else {
            logger.info("📧 Total reminder emails sent: {}", emailsSent);
        }
    }

    private boolean sendTaskReminderEmail(Task task, long hoursUntilDue) {
        try {
            User user = task.getUser();
            if (user != null && user.getEmail() != null) {
                // Format the due date nicely
                DateTimeFormatter formatter = DateTimeFormatter.ofPattern("MMM dd, yyyy 'at' hh:mm a");
                String formattedDueDate = task.getDueDate().format(formatter);
                
                // Send the email
                emailService.sendTaskReminderToUser(
                    user.getEmail(),
                    user.getUsername(),
                    task.getTitle(),
                    task.getDescription(), 
                    formattedDueDate, 
                    (int) hoursUntilDue
                );
                
                logger.info("📧 Email reminder sent to {} for task: {}", user.getEmail(), task.getTitle());
                return true;
            } else {
                logger.warn("⚠️ No user or email found for task: {}", task.getTitle());
                return false;
            }
            
        } catch (Exception e) {
            logger.error("❌ Failed to send reminder email for task: {}", task.getTitle(), e);
            return false;
        }
    }

    public void sendManualReminder(Long taskId) {
        try {
            Task task = taskRepository.findById(taskId).orElse(null);
            if (task != null && task.getDueDate() != null) {
                LocalDateTime now = LocalDateTime.now();
                long hoursUntilDue = ChronoUnit.HOURS.between(now, task.getDueDate());
                
                boolean emailSent = sendTaskReminderEmail(task, hoursUntilDue);
                if (emailSent) {
                    logger.info("📧 Manual reminder sent for task: {}", task.getTitle());
                } else {
                    logger.warn("⚠️ Failed to send manual reminder for task: {}", task.getTitle());
                }
            } else {
                logger.warn("⚠️ Task not found or has no due date for manual reminder: {}", taskId);
            }
        } catch (Exception e) {
            logger.error("❌ Failed to send manual reminder for task: {}", taskId, e);
        }
    }

    // Method to check and send immediate reminders for tasks due soon
    public void checkAndSendImmediateReminders() {
        logger.info("🚀 Performing immediate reminder check...");
        checkTasksForReminders();
    }
}