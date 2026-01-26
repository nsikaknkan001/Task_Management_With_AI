# TaskManager Pro API Documentation

This folder contains comprehensive API documentation for the TaskManager Pro application.

## 📁 Structure

- `auth/` - Authentication endpoints
- `tasks/` - Task management endpoints  
- `ai/` - AI roadmap generation endpoints
- `examples/` - Request/response examples
- `postman/` - Postman collection for testing

## 🚀 Base URL

```
http://localhost:8080/api
```

## 🔐 Authentication

All protected endpoints require a Bearer token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## 📊 Response Format

All API responses follow this standard format:

### Success Response
```json
{
  "data": { ... },
  "message": "Success message",
  "timestamp": "2025-01-03T10:30:00Z"
}
```

### Error Response
```json
{
  "message": "Error message",
  "status": 400,
  "timestamp": "2025-01-03T10:30:00Z",
  "errors": {
    "field": "Validation error message"
  }
}
```

## 🔗 Quick Links

- [Authentication API](./auth/)
- [Tasks API](./tasks/)
- [AI Roadmap API](./ai/)
- [Request Examples](./examples/)
- [Postman Collection](./postman/)

## 🛠 Testing

Import the Postman collection from the `postman/` folder to test all endpoints easily.

## 📝 Notes

- All timestamps are in ISO 8601 format
- All endpoints support CORS for frontend integration
- Rate limiting is applied to prevent abuse
- Email notifications are sent automatically for task reminders