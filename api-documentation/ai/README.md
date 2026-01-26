# AI Roadmap API

Base URL: `http://localhost:8080/api/ai`

**Authentication Required**: All endpoints require Bearer token

## Endpoints

### 1. Generate Roadmap

**POST** `/generate-roadmap`

Generate an AI-powered roadmap for a task using Google Gemini AI.

#### Headers
```
Authorization: Bearer <jwt-token>
Content-Type: application/json
```

#### Request Body
```json
{
  "title": "Build a React Native Mobile App",
  "description": "Create a cross-platform mobile application for task management with user authentication, real-time sync, and offline capabilities",
  "priority": "HIGH"
}
```

#### Response
```json
{
  "roadmap": "🎯 AI-Generated Task Roadmap\n\n📋 Task: Build a React Native Mobile App\n🔥 Priority: HIGH\n\n📈 Project Roadmap:\n\n## Phase 1: Planning & Setup (Week 1)\n1. **Requirements Analysis**\n   - Define user stories and acceptance criteria\n   - Create wireframes and mockups\n   - Plan database schema\n\n2. **Development Environment Setup**\n   - Install React Native CLI\n   - Set up Android Studio and Xcode\n   - Configure development devices/emulators\n\n## Phase 2: Core Development (Weeks 2-4)\n3. **Authentication System**\n   - Implement user registration/login\n   - Set up JWT token management\n   - Add biometric authentication\n\n4. **Task Management Features**\n   - Create task CRUD operations\n   - Implement task categories and priorities\n   - Add due date and reminder functionality\n\n## Phase 3: Advanced Features (Weeks 5-6)\n5. **Real-time Synchronization**\n   - Integrate WebSocket connections\n   - Implement conflict resolution\n   - Add real-time notifications\n\n6. **Offline Capabilities**\n   - Set up local database (SQLite)\n   - Implement data synchronization\n   - Handle offline/online state management\n\n## Phase 4: Testing & Deployment (Week 7)\n7. **Testing**\n   - Unit testing with Jest\n   - Integration testing\n   - User acceptance testing\n\n8. **Deployment**\n   - Build production APK/IPA\n   - Deploy to app stores\n   - Set up analytics and crash reporting\n\n## 💡 Key Technologies:\n- React Native\n- Redux/Context API\n- AsyncStorage\n- Firebase/Supabase\n- WebSocket\n- SQLite\n\n## 🎯 Success Metrics:\n- App loads in <3 seconds\n- 99.9% crash-free sessions\n- Offline functionality works seamlessly\n- User authentication is secure and fast\n\n## ⚠️ Potential Challenges:\n- Platform-specific UI differences\n- Performance optimization\n- App store approval process\n- Data synchronization conflicts\n\n## 📚 Recommended Resources:\n- React Native Documentation\n- Redux Toolkit Guide\n- Firebase React Native Setup\n- App Store Guidelines",
  "message": "Roadmap generated successfully"
}
```

#### Status Codes
- `200` - Roadmap generated successfully
- `400` - Invalid request parameters
- `401` - Unauthorized
- `500` - AI service error (fallback to mock roadmap)

---

### 2. Regenerate Roadmap

**POST** `/regenerate-roadmap`

Regenerate a roadmap with updated content and approach.

#### Headers
```
Authorization: Bearer <jwt-token>
Content-Type: application/json
```

#### Request Body
```json
{
  "title": "Build a React Native Mobile App",
  "description": "Create a cross-platform mobile application for task management with user authentication, real-time sync, and offline capabilities",
  "priority": "HIGH"
}
```

#### Response
```json
{
  "roadmap": "🔄 UPDATED 🎯 AI-Generated Task Roadmap\n\n📋 Task: Build a React Native Mobile App\n🔥 Priority: HIGH\n\n📈 Revised Project Roadmap:\n\n## Phase 1: Foundation (Week 1)\n1. **Project Architecture**\n   - Choose state management solution (Redux Toolkit)\n   - Set up folder structure and coding standards\n   - Configure ESLint and Prettier\n\n2. **Development Setup**\n   - Initialize React Native project with TypeScript\n   - Set up debugging tools (Flipper, React Native Debugger)\n   - Configure CI/CD pipeline\n\n## Phase 2: Core Features (Weeks 2-3)\n3. **Navigation & UI Framework**\n   - Implement React Navigation v6\n   - Set up UI component library (NativeBase/React Native Elements)\n   - Create reusable components\n\n4. **Authentication Flow**\n   - Implement secure token storage (Keychain/Keystore)\n   - Add social login options (Google, Apple)\n   - Set up user profile management\n\n## Phase 3: Task Management (Weeks 4-5)\n5. **Task Operations**\n   - Build task creation with rich text editor\n   - Implement drag-and-drop task organization\n   - Add task filtering and search functionality\n\n6. **Notifications & Reminders**\n   - Set up push notifications (Firebase Cloud Messaging)\n   - Implement local notifications\n   - Add smart reminder suggestions\n\n## Phase 4: Sync & Offline (Week 6)\n7. **Data Management**\n   - Implement optimistic updates\n   - Set up background sync\n   - Add conflict resolution strategies\n\n8. **Performance Optimization**\n   - Implement lazy loading\n   - Optimize bundle size\n   - Add performance monitoring\n\n## Phase 5: Polish & Launch (Week 7)\n9. **Quality Assurance**\n   - Automated testing with Detox\n   - Performance testing\n   - Security audit\n\n10. **App Store Preparation**\n    - Create app store assets\n    - Write app descriptions\n    - Submit for review\n\n## 🚀 Enhanced Features:\n- Dark/Light theme support\n- Accessibility compliance (WCAG)\n- Multi-language support\n- Data export functionality\n- Team collaboration features\n\n## 📊 KPIs to Track:\n- Daily/Monthly Active Users\n- Task completion rate\n- App retention rate\n- Crash-free session percentage\n- Average session duration\n\n## 🔧 Development Tools:\n- React Native CLI\n- TypeScript\n- Redux Toolkit\n- React Query\n- Flipper\n- CodePush\n\n## 💰 Monetization Strategy:\n- Freemium model\n- Premium features (advanced analytics, team features)\n- In-app purchases for themes\n- Enterprise licensing",
  "message": "Roadmap regenerated successfully"
}
```

#### Status Codes
- `200` - Roadmap regenerated successfully
- `400` - Invalid request parameters
- `401` - Unauthorized
- `500` - AI service error (fallback to mock roadmap)

---

## Request Parameters

### Required Fields

#### title
- **Type**: String
- **Required**: Yes
- **Description**: The task title to generate roadmap for
- **Example**: "Build a React Native Mobile App"

#### description
- **Type**: String  
- **Required**: Yes
- **Description**: Detailed description of the task
- **Example**: "Create a cross-platform mobile application..."

#### priority
- **Type**: String
- **Required**: No (defaults to "MEDIUM")
- **Values**: "HIGH", "MEDIUM", "LOW"
- **Description**: Task priority level

## AI Service Integration

### Google Gemini AI
- **Model**: `gemini-2.0-flash`
- **API Key**: Configured in backend
- **Endpoint**: `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent`

### Fallback System
If the AI service is unavailable, the system provides a structured fallback roadmap:

```json
{
  "roadmap": "🎯 Task Roadmap\n\n📋 Task: [Task Title]\n🔥 Priority: [Priority]\n\n📈 Steps:\n1. Break down the task\n2. Create action plan\n3. Execute systematically\n4. Monitor progress\n5. Complete and review",
  "message": "Roadmap generated successfully"
}
```

## Roadmap Features

### Content Structure
- **Header**: Task title and priority
- **Phases**: Organized development phases
- **Steps**: Detailed action items
- **Technologies**: Recommended tech stack
- **Metrics**: Success criteria
- **Challenges**: Potential obstacles
- **Resources**: Learning materials

### Formatting
- Emoji icons for visual appeal
- Markdown-style formatting
- Hierarchical organization
- Actionable items
- Time estimates
- Resource links

## Error Handling

### Common Errors

#### 400 Bad Request
```json
{
  "message": "Task title is required"
}
```

#### 401 Unauthorized
```json
{
  "message": "Unauthorized access"
}
```

#### 500 Internal Server Error
```json
{
  "message": "Failed to generate roadmap: AI service unavailable"
}
```

## Usage Tips

1. **Detailed Descriptions**: Provide comprehensive task descriptions for better roadmaps
2. **Specific Requirements**: Include technical requirements and constraints
3. **Priority Setting**: Use appropriate priority levels to get tailored advice
4. **Regeneration**: Use regenerate endpoint for alternative approaches
5. **Integration**: Combine with task creation for seamless workflow

## Rate Limiting

- **Requests per minute**: 60
- **Requests per hour**: 1000
- **Concurrent requests**: 10

## Best Practices

1. **Input Quality**: Provide clear, detailed task descriptions
2. **Error Handling**: Always handle potential AI service failures
3. **Caching**: Consider caching roadmaps to reduce API calls
4. **User Experience**: Show loading states during generation
5. **Fallback**: Always have fallback content ready

## Integration Example

```javascript
// Frontend integration example
const generateRoadmap = async (taskData) => {
  try {
    const response = await fetch('/api/ai/generate-roadmap', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(taskData)
    });
    
    const result = await response.json();
    return result.roadmap;
  } catch (error) {
    console.error('Roadmap generation failed:', error);
    return 'Failed to generate roadmap. Please try again.';
  }
};
```