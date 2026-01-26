# Task Manager Application

A full-stack task management application with AI-powered roadmap generation using Google Gemini AI.

## Features

✨ **Core Features:**
- User authentication and registration with email verification
- Task CRUD operations (Create, Read, Update, Delete)
- Task prioritization (High, Medium, Low)
- AI-powered task roadmap generation using Google Gemini
- Real-time task reminders and notifications
- Responsive Angular frontend with Material Design
- RESTful API backend with Spring Boot

🤖 **AI Integration:**
- Google Gemini AI integration for intelligent roadmap generation
- Fallback implementation when AI service is unavailable
- Contextual task recommendations based on title and description

🔐 **Security Features:**
- JWT-based authentication
- CORS configuration for cross-origin requests
- Email verification system
- Secure password hashing with BCrypt

## Technology Stack

**Frontend:**
- Angular 20.0.0
- Angular Material
- TypeScript
- RxJS

**Backend:**
- Spring Boot 3.2.0
- Spring Security
- Spring Data JPA
- Java 17
- Maven

**Database:**
- H2 (Development)
- MySQL (Production)

**AI Service:**
- Google Gemini AI API

## Quick Start

### Prerequisites
- Java 17 or higher
- Node.js and npm
- Maven
- Git

### Installation

1. **Clone the repository:**
   ```bash
   cd "/Users/BookAir/Downloads/project 2"
   ```

2. **Install frontend dependencies:**
   ```bash
   npm install
   ```

3. **Configure Google Gemini API:**
   - Your API key is already configured: `AIzaSyAOBvzv7wqVEX30AZWrTHkZJoV4joWCc18`
   - API endpoint: `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent`

4. **Start the application:**
   ```bash
   ./start-app.sh
   ```

### Manual Setup

**Backend (Spring Boot):**
```bash
cd backend
mvn spring-boot:run
```

**Frontend (Angular):**
```bash
npm start
```

## Access Points

- **Frontend Application:** http://localhost:4200
- **Backend API:** http://localhost:8080
- **H2 Database Console:** http://localhost:8080/h2-console
  - JDBC URL: `jdbc:h2:mem:taskmanager`
  - Username: `sa`
  - Password: (leave empty)

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/verify-email` - Email verification
- `POST /api/auth/resend-code` - Resend verification code

### Tasks
- `GET /api/tasks` - Get all user tasks
- `POST /api/tasks` - Create new task
- `PUT /api/tasks/{id}` - Update task
- `DELETE /api/tasks/{id}` - Delete task

### AI Roadmap
- `POST /api/ai/generate-roadmap` - Generate AI roadmap
- `POST /api/ai/regenerate-roadmap` - Regenerate roadmap

## Google Gemini AI Configuration

The application is configured with your Google Gemini API key:

**Configuration Location:** `backend/src/main/resources/application.properties`

```properties
# Google Gemini AI Configuration
gemini.api.key=AIzaSyAOBvzv7wqVEX30AZWrTHkZJoV4joWCc18
gemini.api.url=https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent
```

**API Usage:**
- The service calls the Gemini API with a structured prompt
- Returns AI-generated roadmaps with steps, timelines, and tips
- Falls back to mock implementation if AI service is unavailable

## Database Configuration

### Development (H2 - Current Setup)
```properties
spring.datasource.url=jdbc:h2:mem:taskmanager
spring.datasource.username=sa
spring.datasource.password=
```

### Production (MySQL - Optional)
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/taskmanager
spring.datasource.username=root
spring.datasource.password=prajin@123
```

## Email Configuration

Email verification is configured with Gmail SMTP:

```properties
spring.mail.host=smtp.gmail.com
spring.mail.username=reksit2005@gmail.com
spring.mail.password=vvog gosd mpgj ivmk
```

## Security Configuration

- **CORS:** Configured to allow all origins for development
- **JWT:** Secure token-based authentication
- **CSRF:** Disabled for API endpoints
- **Session:** Stateless configuration

## Error Resolution

### Backend Issues
1. **Bean conflicts:** Resolved CORS configuration conflicts
2. **Database connection:** Switched to H2 for easier setup
3. **Compilation errors:** Fixed import statements and method references

### Frontend Issues
1. **Dependencies:** All Angular dependencies are installed
2. **Routing:** Configured with proper route guards
3. **Interceptors:** HTTP interceptors for authentication and error handling

## Project Structure

```
project 2/
├── backend/                 # Spring Boot backend
│   ├── src/main/java/       # Java source code
│   ├── src/main/resources/  # Configuration files
│   └── pom.xml             # Maven dependencies
├── src/                    # Angular frontend
│   ├── components/         # Angular components
│   ├── services/          # Angular services
│   ├── models/           # TypeScript models
│   └── main.ts          # Application entry point
├── package.json          # Frontend dependencies
├── start-app.sh         # Application startup script
└── README.md           # This file
```

## Troubleshooting

1. **Port conflicts:** Backend runs on 8080, frontend on 4200
2. **Database issues:** H2 is in-memory, data resets on restart
3. **API errors:** Check backend logs in `backend/backend.log`
4. **Frontend errors:** Check frontend logs in `frontend.log`

## Development Notes

- **Hot reload:** Both frontend and backend support hot reloading
- **Database console:** Access H2 console for database inspection
- **API testing:** Use Postman or curl for API testing
- **Logs:** Detailed logging enabled for debugging

## Next Steps

1. **Test user registration and login**
2. **Create tasks and test CRUD operations**
3. **Test AI roadmap generation with Gemini API**
4. **Configure email verification (optional)**
5. **Switch to MySQL for production (optional)**

---

**Application Status:** ✅ Ready to run with all errors resolved and Google Gemini AI integrated!
