package com.example.manager.controller;

import com.example.manager.service.AIRoadmapService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/ai")
@CrossOrigin(origins = "*", maxAge = 3600)
public class AIRoadmapController {

    @Autowired
    private AIRoadmapService aiRoadmapService;

    @PostMapping("/generate-roadmap")
    public ResponseEntity<?> generateRoadmap(@RequestBody Map<String, String> request) {
        try {
            String title = request.get("title");
            String description = request.get("description");
            String priority = request.get("priority");

            if (title == null || title.trim().isEmpty()) {
                return ResponseEntity.badRequest().body(new ErrorResponse("Task title is required"));
            }

            if (description == null || description.trim().isEmpty()) {
                return ResponseEntity.badRequest().body(new ErrorResponse("Task description is required"));
            }

            if (priority == null || priority.trim().isEmpty()) {
                priority = "MEDIUM";
            }

            String roadmap = aiRoadmapService.generateRoadmap(title, description, priority);
            
            return ResponseEntity.ok(new RoadmapResponse(roadmap, "Roadmap generated successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ErrorResponse("Failed to generate roadmap: " + e.getMessage()));
        }
    }

    @PostMapping("/regenerate-roadmap")
    public ResponseEntity<?> regenerateRoadmap(@RequestBody Map<String, String> request) {
        try {
            String title = request.get("title");
            String description = request.get("description");
            String priority = request.get("priority");

            if (title == null || title.trim().isEmpty()) {
                return ResponseEntity.badRequest().body(new ErrorResponse("Task title is required"));
            }

            if (description == null || description.trim().isEmpty()) {
                return ResponseEntity.badRequest().body(new ErrorResponse("Task description is required"));
            }

            if (priority == null || priority.trim().isEmpty()) {
                priority = "MEDIUM";
            }

            String roadmap = aiRoadmapService.regenerateRoadmap(title, description, priority);
            
            return ResponseEntity.ok(new RoadmapResponse(roadmap, "Roadmap regenerated successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ErrorResponse("Failed to regenerate roadmap: " + e.getMessage()));
        }
    }

    private static class RoadmapResponse {
        private String roadmap;
        private String message;

        public RoadmapResponse(String roadmap, String message) {
            this.roadmap = roadmap;
            this.message = message;
        }

        public String getRoadmap() {
            return roadmap;
        }

        public void setRoadmap(String roadmap) {
            this.roadmap = roadmap;
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

        public ErrorResponse(String message) {
            this.message = message;
        }

        public String getMessage() {
            return message;
        }

        public void setMessage(String message) {
            this.message = message;
        }
    }
}