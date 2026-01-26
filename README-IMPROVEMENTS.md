# TaskManager Pro - AI-Powered Task Management System

![TaskManager Pro](https://img.shields.io/badge/TaskManager-Pro-blue.svg)
![Status](https://img.shields.io/badge/Status-Production%20Ready-green.svg)
![Version](https://img.shields.io/badge/Version-2.0-brightgreen.svg)

## 🚀 Features

### ✅ **Core Functionality**
- **Smart Task Management** - Create, edit, delete, and organize tasks with priorities
- **Real-time Updates** - Live dashboard updates without page refresh
- **AI-Powered Roadmaps** - Get intelligent step-by-step plans for complex tasks
- **Task Status Tracking** - Pending/Completed status with visual indicators

### 🔔 **Advanced Reminder System**
- **Real-time Email Reminders** - Automatic email alerts for tasks due within 24 hours
- **Smart Notification Levels**:
  - 🚨 **CRITICAL** (≤1 hour): High-priority alerts with persistent notifications
  - ⚠️ **URGENT** (≤6 hours): Medium-priority alerts
  - 📋 **REMINDER** (≤12 hours): Standard notifications
  - 📅 **UPCOMING** (≤24 hours): Early warnings
- **Browser Push Notifications** - Desktop notifications with smart urgency levels
- **Dynamic Reminder Checking** - Every 30 seconds for real-time alerts
- **Backend Scheduler** - Automated email sending every 5 minutes

### 🎨 **Professional UI/UX**
- **Modern Auth Design** - Split-screen layout with brand showcase
- **Responsive Design** - Mobile-first, works on all devices
- **Dark Theme Support** - Professional dark color scheme
- **Interactive Elements** - Smooth animations and transitions
- **Password Validation** - Real-time strength checking with visual feedback

### 🤖 **AI Integration**
- **Google Gemini AI** - Powered roadmap generation
- **Intelligent Task Breakdown** - Complex projects simplified
- **Smart Suggestions** - AI-generated step-by-step plans

### 🔐 **Security Features**
- **JWT Authentication** - Secure user sessions
- **Email Verification** - Account security with 4-digit codes
- **Password Requirements** - Strong password enforcement
- **CORS Protection** - Secure API endpoints

## 🛠 **Technology Stack**

### Frontend
- **Angular 18** - Modern TypeScript framework
- **Standalone Components** - Latest Angular architecture
- **Reactive Forms** - Advanced form handling
- **RxJS** - Reactive programming with real-time updates
- **Tailwind CSS** - Utility-first styling

### Backend
- **Spring Boot 3** - Enterprise Java framework
- **Spring Security** - Authentication and authorization
- **Spring Data JPA** - Database operations
- **MySQL** - Reliable database storage
- **Spring Mail** - Email service integration
- **Spring Scheduler** - Automated task execution

### Infrastructure
- **Gmail SMTP** - Reliable email delivery
- **Google Gemini AI** - Advanced AI capabilities
- **Maven** - Build and dependency management
- **npm** - Frontend package management

## 📧 **Email Configuration**

The system uses Gmail SMTP for reliable email delivery:

```properties
# Email Configuration (application.properties)
spring.mail.host=smtp.gmail.com
spring.mail.port=587
spring.mail.username=your-email@gmail.com
spring.mail.password=your-app-password
spring.mail.properties.mail.smtp.auth=true
spring.mail.properties.mail.smtp.starttls.enable=true
```

**Setup Instructions:**
1. Enable 2-Factor Authentication on your Gmail account
2. Generate an App Password for TaskManager Pro
3. Update the email credentials in `application.properties`
4. Restart the backend service

## 🚀 **Quick Start**

### Prerequisites
- Java 17+
- Node.js 18+
- MySQL 8.0+
- Maven 3.6+

### 1. Clone Repository
```bash
git clone <repository-url>
cd "project 3"
```

### 2. Database Setup
```sql
CREATE DATABASE taskmanager;
-- Database will be auto-configured on first run
```

### 3. Configure Environment
Update `backend/src/main/resources/application.properties`:
```properties
# Database
spring.datasource.username=your-username
spring.datasource.password=your-password

# Email
spring.mail.username=your-email@gmail.com
spring.mail.password=your-app-password

# AI
gemini.api.key=your-gemini-api-key
```

### 4. Start Application
```bash
# Option 1: Use startup script (Recommended)
./start-app.sh

# Option 2: Manual start
# Terminal 1 - Backend
cd backend && mvn spring-boot:run

# Terminal 2 - Frontend  
npm start
```

### 5. Access Application
- **Frontend**: http://localhost:4200
- **Backend API**: http://localhost:8080
- **API Documentation**: http://localhost:8080/swagger-ui.html

## 📱 **Usage Guide**

### Getting Started
1. **Register** - Create account with strong password
2. **Verify Email** - Enter 4-digit verification code
3. **Login** - Access your personalized dashboard

### Task Management
1. **Create Tasks** - Click "Create New Task" button
2. **Set Priorities** - Choose HIGH, MEDIUM, or LOW priority
3. **Add Due Dates** - Set deadlines for automatic reminders
4. **Generate Roadmaps** - Use AI to break down complex tasks
5. **Track Progress** - Mark tasks as completed when done

### Reminder System
- **Automatic Setup** - Reminders activate automatically when logged in
- **Email Alerts** - Receive emails for tasks due within 24 hours
- **Browser Notifications** - Enable for real-time desktop alerts
- **Priority Levels** - Different urgency levels based on time remaining

## 🔧 **Configuration**

### Frontend Configuration
```typescript
// src/services/task-reminder.service.ts
private reminderInterval = 30000; // Check every 30 seconds
```

### Backend Configuration
```java
// TaskReminderService.java
@Scheduled(fixedRate = 300000) // Check every 5 minutes
```

### Notification Settings
```typescript
// Browser notification options
const options: NotificationOptions = {
  body: message,
  icon: '/favicon.ico',
  requireInteraction: urgency === 'high',
  tag: 'task-reminder'
};
```

## 📊 **System Architecture**

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Angular 18    │    │  Spring Boot 3  │    │     MySQL 8     │
│   Frontend      │◄──►│    Backend      │◄──►│    Database     │
│                 │    │                 │    │                 │
│ • Components    │    │ • REST APIs     │    │ • User Data     │
│ • Services      │    │ • Security      │    │ • Task Data     │
│ • Guards        │    │ • Scheduling    │    │ • Relationships │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │
         │                       │
         ▼                       ▼
┌─────────────────┐    ┌─────────────────┐
│ Browser Notif.  │    │  Gmail SMTP +   │
│ Push Alerts     │    │  Gemini AI      │
└─────────────────┘    └─────────────────┘
```

## 🎯 **Key Improvements Made**

### 1. **Fixed Email Reminder System**
- ✅ Increased backend scheduler frequency (30min → 5min)
- ✅ Real-time frontend checking (60s → 30s)
- ✅ Proper email service integration
- ✅ Dynamic reminder flag management

### 2. **Enhanced Real-time Features**
- ✅ Live dashboard updates without refresh
- ✅ Real-time task status synchronization
- ✅ Automatic reminder service initialization
- ✅ Background service management

### 3. **Fixed Browser Notifications**
- ✅ Resolved vibrate API compatibility issues
- ✅ Progressive notification permissions
- ✅ Smart urgency-based notifications
- ✅ Cross-platform notification support

### 4. **Professional Auth UI/UX**
- ✅ Modern split-screen design
- ✅ Brand showcase with features
- ✅ Interactive password validation
- ✅ Responsive mobile-first design
- ✅ Smooth animations and transitions

### 5. **System Reliability**
- ✅ Proper error handling
- ✅ Fallback mechanisms
- ✅ Service lifecycle management
- ✅ Memory leak prevention

## 🚀 **Performance Features**

- **Real-time Updates**: 30-second intervals for live data
- **Smart Caching**: Efficient data management
- **Lazy Loading**: Optimized component loading
- **Background Services**: Non-blocking operations
- **Error Recovery**: Automatic retry mechanisms

## 📈 **Monitoring & Logs**

### Application Logs
```bash
# Backend logs
tail -f backend.log

# Frontend logs  
tail -f frontend.log

# Application logs
cd backend && mvn spring-boot:run --debug
```

### Health Checks
- **Backend**: http://localhost:8080/actuator/health
- **Database**: Connection status in logs
- **Email Service**: Test email functionality
- **AI Service**: Gemini API connectivity

## 🤝 **Contributing**

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📝 **License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 **Support**

### Common Issues

**Email not sending?**
- Check Gmail App Password configuration
- Verify SMTP settings
- Ensure 2FA is enabled on Gmail account

**Notifications not working?**
- Allow browser notifications when prompted
- Check browser notification settings
- Verify service worker registration

**Tasks not updating?**
- Check network connectivity
- Verify backend service is running
- Clear browser cache and cookies

### Contact
- **Email**: support@taskmanagerpro.com
- **GitHub Issues**: [Create an issue](../../issues)
- **Documentation**: [Wiki](../../wiki)

---

## 🎉 **Ready to Get Started?**

```bash
# Quick start command
./start-app.sh
```

**Happy Task Managing! 🚀**
