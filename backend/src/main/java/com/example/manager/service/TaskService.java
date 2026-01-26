package com.example.manager.service;
import com.example.manager.dto.TaskRequest;
import com.example.manager.dto.TaskResponse;
import com.example.manager.entity.Task;
import com.example.manager.entity.User;
import com.example.manager.repository.TaskRepository;
import com.example.manager.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class TaskService {

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private UserRepository userRepository;

    private User getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public List<TaskResponse> getAllTasks() {
        User user = getCurrentUser();
        return taskRepository.findByUserOrderByCreatedAtDesc(user)
                .stream()
                .map(TaskResponse::new)
                .collect(Collectors.toList());
    }

    public List<TaskResponse> getPendingTasks() {
        User user = getCurrentUser();
        return taskRepository.findByUserAndStatusOrderByCreatedAtDesc(user, Task.TaskStatus.PENDING)
                .stream()
                .map(TaskResponse::new)
                .collect(Collectors.toList());
    }

    public List<TaskResponse> getCompletedTasks() {
        User user = getCurrentUser();
        return taskRepository.findByUserAndStatusOrderByCreatedAtDesc(user, Task.TaskStatus.COMPLETED)
                .stream()
                .map(TaskResponse::new)
                .collect(Collectors.toList());
    }

    public TaskResponse getTaskById(Long id) {
        User user = getCurrentUser();
        Task task = taskRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new RuntimeException("Task not found"));
        return new TaskResponse(task);
    }

    public TaskResponse createTask(TaskRequest taskRequest) {
        User user = getCurrentUser();
        
        Task task = new Task();
        task.setTitle(taskRequest.getTitle());
        task.setDescription(taskRequest.getDescription());
        task.setPriority(taskRequest.getPriority());
        task.setDueDate(taskRequest.getDueDate());
        task.setRoadmap(taskRequest.getRoadmap());
        task.setUser(user);

        Task savedTask = taskRepository.save(task);
        return new TaskResponse(savedTask);
    }

    public TaskResponse updateTask(Long id, TaskRequest taskRequest) {
        User user = getCurrentUser();
        Task task = taskRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new RuntimeException("Task not found"));

        task.setTitle(taskRequest.getTitle());
        task.setDescription(taskRequest.getDescription());
        task.setPriority(taskRequest.getPriority());
        task.setDueDate(taskRequest.getDueDate());
        task.setRoadmap(taskRequest.getRoadmap());

        Task updatedTask = taskRepository.save(task);
        return new TaskResponse(updatedTask);
    }

    public void deleteTask(Long id) {
        User user = getCurrentUser();
        Task task = taskRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new RuntimeException("Task not found"));
        taskRepository.delete(task);
    }

    public TaskResponse markTaskAsCompleted(Long id) {
        User user = getCurrentUser();
        Task task = taskRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new RuntimeException("Task not found"));

        task.setStatus(Task.TaskStatus.COMPLETED);
        Task updatedTask = taskRepository.save(task);
        return new TaskResponse(updatedTask);
    }

    public TaskResponse markTaskAsPending(Long id) {
        User user = getCurrentUser();
        Task task = taskRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new RuntimeException("Task not found"));

        task.setStatus(Task.TaskStatus.PENDING);
        // Reset reminder sent when task is marked as pending again
        task.setReminderSent(false);
        Task updatedTask = taskRepository.save(task);
        return new TaskResponse(updatedTask);
    }

    public void markReminderSent(Long id) {
        User user = getCurrentUser();
        Task task = taskRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new RuntimeException("Task not found"));
        
        task.setReminderSent(true);
        taskRepository.save(task);
    }
}