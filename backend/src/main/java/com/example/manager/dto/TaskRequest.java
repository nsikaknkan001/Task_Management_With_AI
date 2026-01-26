package com.example.manager.dto;

import com.example.manager.entity.Task;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.time.LocalDateTime;

public class TaskRequest {
    
    @NotBlank(message = "Task title is required")
    @Size(max = 100, message = "Title must not exceed 100 characters")
    private String title;

    @NotBlank(message = "Task description is required")
    @Size(max = 500, message = "Description must not exceed 500 characters")
    private String description;

    private Task.TaskPriority priority = Task.TaskPriority.MEDIUM;
    
    private LocalDateTime dueDate;
    
    private String roadmap;

    // Constructors
    public TaskRequest() {}

    public TaskRequest(String title, String description, Task.TaskPriority priority, LocalDateTime dueDate) {
        this.title = title;
        this.description = description;
        this.priority = priority;
        this.dueDate = dueDate;
    }

    // Getters and Setters
    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Task.TaskPriority getPriority() {
        return priority;
    }

    public void setPriority(Task.TaskPriority priority) {
        this.priority = priority;
    }

    public LocalDateTime getDueDate() {
        return dueDate;
    }

    public void setDueDate(LocalDateTime dueDate) {
        this.dueDate = dueDate;
    }

    public String getRoadmap() {
        return roadmap;
    }

    public void setRoadmap(String roadmap) {
        this.roadmap = roadmap;
    }
}