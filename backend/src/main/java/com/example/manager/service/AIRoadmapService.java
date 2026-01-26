package com.example.manager.service;

import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;
import java.util.Random;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

@Service
public class AIRoadmapService {

    private static final Logger logger = LoggerFactory.getLogger(AIRoadmapService.class);
    
    @Value("${gemini.api.key}")
    private String geminiApiKey;
    
    @Value("${gemini.api.url}")
    private String geminiApiUrl;
    
    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;
    private final Random random = new Random();

    public AIRoadmapService() {
        this.restTemplate = new RestTemplate();
        this.objectMapper = new ObjectMapper();
    }

    public String generateRoadmap(String taskTitle, String taskDescription, String priority) {
        try {
            String prompt = buildPrompt(taskTitle, taskDescription, priority);
            String aiResponse = callGeminiAPI(prompt);
            
            if (aiResponse != null && !aiResponse.trim().isEmpty()) {
                return formatAIResponse(aiResponse, taskTitle, priority);
            } else {
                logger.warn("AI API failed, using fallback implementation");
                return generateMockRoadmap(taskTitle, taskDescription, priority);
            }
        } catch (Exception e) {
            logger.error("Error generating AI roadmap: ", e);
            return generateMockRoadmap(taskTitle, taskDescription, priority);
        }
    }

    private String buildPrompt(String taskTitle, String taskDescription, String priority) {
        return String.format(
            "Create a professional task roadmap for: '%s'. Description: '%s'. Priority: %s. " +
            "Format the response as a structured roadmap with clear sections. " +
            "Include: 1) Overview, 2) Step-by-step plan with timelines, 3) Key milestones, 4) Resources needed, 5) Success metrics. " +
            "Keep the response under 5000 characters. Use emojis and professional formatting.",
            taskTitle, taskDescription, priority
        );
    }

    private String callGeminiAPI(String prompt) {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("x-goog-api-key", geminiApiKey);

            Map<String, Object> requestBody = new HashMap<>();
            Map<String, Object> content = new HashMap<>();
            Map<String, String> part = new HashMap<>();
            part.put("text", prompt);
            content.put("parts", Arrays.asList(part));
            requestBody.put("contents", Arrays.asList(content));

            HttpEntity<Map<String, Object>> request = new HttpEntity<>(requestBody, headers);
            ResponseEntity<String> response = restTemplate.postForEntity(geminiApiUrl, request, String.class);
            
            if (response.getStatusCode() == HttpStatus.OK) {
                return extractTextFromResponse(response.getBody());
            }
            return null;
        } catch (Exception e) {
            logger.error("Error calling Gemini API: ", e);
            return null;
        }
    }

    private String extractTextFromResponse(String responseBody) {
        try {
            JsonNode root = objectMapper.readTree(responseBody);
            JsonNode candidates = root.path("candidates");
            if (candidates.isArray() && candidates.size() > 0) {
                JsonNode content = candidates.get(0).path("content");
                JsonNode parts = content.path("parts");
                if (parts.isArray() && parts.size() > 0) {
                    return parts.get(0).path("text").asText();
                }
            }
            return null;
        } catch (Exception e) {
            logger.error("Error parsing Gemini API response: ", e);
            return null;
        }
    }

    private String formatAIResponse(String aiResponse, String taskTitle, String priority) {
        // Limit response to 5000 characters
        if (aiResponse.length() > 5000) {
            aiResponse = aiResponse.substring(0, 4950) + "...";
        }
        
        // Format the response professionally
        StringBuilder formattedResponse = new StringBuilder();
        formattedResponse.append("🎯 **PROFESSIONAL TASK ROADMAP**\n");
        formattedResponse.append("=" + "=".repeat(50) + "\n\n");
        formattedResponse.append("📋 **Task:** ").append(taskTitle).append("\n");
        formattedResponse.append("🔥 **Priority:** ").append(priority).append("\n");
        formattedResponse.append("📅 **Generated:** ").append(java.time.LocalDateTime.now().format(
            java.time.format.DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm"))).append("\n\n");
        formattedResponse.append("-".repeat(60)).append("\n\n");
        formattedResponse.append(aiResponse);
        formattedResponse.append("\n\n").append("-".repeat(60));
        formattedResponse.append("\n💡 **Note:** This roadmap is AI-generated and should be reviewed and adapted as needed.");
        
        String finalResponse = formattedResponse.toString();
        
        // Ensure final response doesn't exceed 5000 characters
        if (finalResponse.length() > 5000) {
            finalResponse = finalResponse.substring(0, 4950) + "...";
        }
        
        return finalResponse;
    }

    private String generateMockRoadmap(String taskTitle, String taskDescription, String priority) {
        StringBuilder roadmap = new StringBuilder();
        roadmap.append("🎯 **PROFESSIONAL TASK ROADMAP**\n");
        roadmap.append("=" + "=".repeat(50) + "\n\n");
        roadmap.append("📋 **Task:** ").append(taskTitle).append("\n");
        roadmap.append("🔥 **Priority:** ").append(priority).append("\n");
        roadmap.append("📅 **Generated:** ").append(java.time.LocalDateTime.now().format(
            java.time.format.DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm"))).append("\n\n");
        roadmap.append("-".repeat(60)).append("\n\n");
        
        roadmap.append("## � **OVERVIEW**\n");
        roadmap.append("This roadmap provides a structured approach to completing: ").append(taskTitle).append("\n");
        roadmap.append("Description: ").append(taskDescription).append("\n\n");
        
        roadmap.append("## 📈 **STEP-BY-STEP EXECUTION PLAN**\n\n");
        roadmap.append("### Phase 1: Planning & Analysis (Day 1-2)\n");
        roadmap.append("• 🔍 Break down the task into smaller components\n");
        roadmap.append("• 📊 Analyze requirements and constraints\n");
        roadmap.append("• 🎯 Define clear objectives and success criteria\n\n");
        
        roadmap.append("### Phase 2: Preparation & Setup (Day 3-4)\n");
        roadmap.append("• 🛠️ Gather necessary resources and tools\n");
        roadmap.append("• 📋 Create detailed action plan\n");
        roadmap.append("• ⚙️ Set up work environment\n\n");
        
        roadmap.append("### Phase 3: Implementation (Day 5-8)\n");
        roadmap.append("• 🚀 Execute the main tasks systematically\n");
        roadmap.append("• 📝 Document progress and challenges\n");
        roadmap.append("• 🔄 Regular progress reviews and adjustments\n\n");
        
        roadmap.append("### Phase 4: Testing & Refinement (Day 9-10)\n");
        roadmap.append("• ✅ Test and validate outcomes\n");
        roadmap.append("• 🔧 Make necessary improvements\n");
        roadmap.append("• 📊 Quality assurance checks\n\n");
        
        roadmap.append("### Phase 5: Completion & Review (Day 11)\n");
        roadmap.append("• 🎉 Finalize and deliver results\n");
        roadmap.append("• 📈 Evaluate success metrics\n");
        roadmap.append("• 📚 Document lessons learned\n\n");
        
        roadmap.append("## 🎯 **KEY MILESTONES**\n");
        roadmap.append("• ✅ Planning Complete (End of Day 2)\n");
        roadmap.append("• ✅ Setup Complete (End of Day 4)\n");
        roadmap.append("• ✅ 50% Implementation (End of Day 6)\n");
        roadmap.append("• ✅ Implementation Complete (End of Day 8)\n");
        roadmap.append("• ✅ Testing Complete (End of Day 10)\n");
        roadmap.append("• ✅ Final Delivery (End of Day 11)\n\n");
        
        roadmap.append("## 🛠️ **RESOURCES NEEDED**\n");
        roadmap.append("• Time allocation based on priority level\n");
        roadmap.append("• Access to relevant tools and platforms\n");
        roadmap.append("• Documentation and reference materials\n");
        roadmap.append("• Support team (if applicable)\n\n");
        
        roadmap.append("## 📊 **SUCCESS METRICS**\n");
        roadmap.append("• Task completion within timeline\n");
        roadmap.append("• Quality meets defined standards\n");
        roadmap.append("• Stakeholder satisfaction\n");
        roadmap.append("• Budget/resource efficiency\n\n");
        
        roadmap.append("-".repeat(60));
        roadmap.append("\n💡 **Note:** This roadmap is AI-generated and should be reviewed and adapted as needed.");
        
        String finalRoadmap = roadmap.toString();
        
        // Ensure response doesn't exceed 5000 characters
        if (finalRoadmap.length() > 5000) {
            finalRoadmap = finalRoadmap.substring(0, 4950) + "...";
        }
        
        return finalRoadmap;
    }

    public String regenerateRoadmap(String taskTitle, String taskDescription, String priority) {
        return "🔄 UPDATED " + generateRoadmap(taskTitle, taskDescription, priority);
    }
}
