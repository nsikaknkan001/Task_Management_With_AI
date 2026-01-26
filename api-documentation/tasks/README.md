# Tasks API

Base URL: `http://localhost:8080/api/tasks`

**Authentication Required**: All endpoints require Bearer token

## Endpoints

### 1. Get All Tasks

**GET** `/`

Retrieve all tasks for the authenticated user.

#### Headers
```
Authorization: Bearer <jwt-token>
```

#### Response
```json
[
  {
    "id": 1,
    "title": "Complete project documentation",
    "description": "Write comprehensive API documentation",
    "priority": "HIGH",
    "status": "PENDING",
    "dueDate": "2025-01-05T15:30:00Z",
    "createdAt": "2025-01-03T10:30:00Z",
    "updatedAt": "2025-01-03T10:30:00Z",
    "userId": 1,
    "reminderSent": false,
    "roadmap": "Step 1: Plan documentation structure..."
  }
]
```

---

### 2. Get Task by ID

**GET** `/{id}`

Retrieve a specific task by ID.

#### Parameters
- `id` (path) - Task ID (integer)

#### Response
```json
{
  "id": 1,
  "title": "Complete project documentation",
  "description": "Write comprehensive API documentation",
  "priority": "HIGH",
  "status": "PENDING",
  "dueDate": "2025-01-05T15:30:00Z",
  "createdAt": "2025-01-03T10:30:00Z",
  "updatedAt": "2025-01-03T10:30:00Z",
  "userId": 1,
  "reminderSent": false,
  "roadmap": "Step 1: Plan documentation structure..."
}
```

#### Status Codes
- `200` - Task found
- `404` - Task not found

---

### 3. Create Task

**POST** `/`

Create a new task.

#### Request Body
```json
{
  "title": "Complete project documentation",
  "description": "Write comprehensive API documentation",
  "priority": "HIGH",
  "dueDate": "2025-01-05T15:30:00Z",
  "roadmap": "Step 1: Plan documentation structure..."
}
```

#### Response
```json
{
  "id": 1,
  "title": "Complete project documentation",
  "description": "Write comprehensive API documentation",
  "priority": "HIGH",
  "status": "PENDING",
  "dueDate": "2025-01-05T15:30:00Z",
  "createdAt": "2025-01-03T10:30:00Z",
  "updatedAt": "2025-01-03T10:30:00Z",
  "userId": 1,
  "reminderSent": false,
  "roadmap": "Step 1: Plan documentation structure..."
}
```

#### Status Codes
- `200` - Task created successfully
- `400` - Validation error

---

### 4. Update Task

**PUT** `/{id}`

Update an existing task.

#### Parameters
- `id` (path) - Task ID (integer)

#### Request Body
```json
{
  "title": "Updated task title",
  "description": "Updated description",
  "priority": "MEDIUM",
  "dueDate": "2025-01-06T15:30:00Z",
  "roadmap": "Updated roadmap..."
}
```

#### Response
```json
{
  "id": 1,
  "title": "Updated task title",
  "description": "Updated description",
  "priority": "MEDIUM",
  "status": "PENDING",
  "dueDate": "2025-01-06T15:30:00Z",
  "createdAt": "2025-01-03T10:30:00Z",
  "updatedAt": "2025-01-03T11:00:00Z",
  "userId": 1,
  "reminderSent": false,
  "roadmap": "Updated roadmap..."
}
```

#### Status Codes
- `200` - Task updated successfully
- `400` - Validation error
- `404` - Task not found

---

### 5. Delete Task

**DELETE** `/{id}`

Delete a task.

#### Parameters
- `id` (path) - Task ID (integer)

#### Response
```
204 No Content
```

#### Status Codes
- `204` - Task deleted successfully
- `404` - Task not found

---

### 6. Mark Task as Completed

**PATCH** `/{id}/complete`

Mark a task as completed.

#### Parameters
- `id` (path) - Task ID (integer)

#### Response
```json
{
  "id": 1,
  "title": "Complete project documentation",
  "description": "Write comprehensive API documentation",
  "priority": "HIGH",
  "status": "COMPLETED",
  "dueDate": "2025-01-05T15:30:00Z",
  "createdAt": "2025-01-03T10:30:00Z",
  "updatedAt": "2025-01-03T11:30:00Z",
  "userId": 1,
  "reminderSent": false,
  "roadmap": "Step 1: Plan documentation structure..."
}
```

---

### 7. Mark Task as Pending

**PATCH** `/{id}/pending`

Mark a task as pending (reopen completed task).

#### Parameters
- `id` (path) - Task ID (integer)

#### Response
```json
{
  "id": 1,
  "title": "Complete project documentation",
  "description": "Write comprehensive API documentation",
  "priority": "HIGH",
  "status": "PENDING",
  "dueDate": "2025-01-05T15:30:00Z",
  "createdAt": "2025-01-03T10:30:00Z",
  "updatedAt": "2025-01-03T11:45:00Z",
  "userId": 1,
  "reminderSent": false,
  "roadmap": "Step 1: Plan documentation structure..."
}
```

---

### 8. Get Pending Tasks

**GET** `/pending`

Retrieve all pending tasks for the authenticated user.

#### Response
```json
[
  {
    "id": 1,
    "title": "Complete project documentation",
    "description": "Write comprehensive API documentation",
    "priority": "HIGH",
    "status": "PENDING",
    "dueDate": "2025-01-05T15:30:00Z",
    "createdAt": "2025-01-03T10:30:00Z",
    "updatedAt": "2025-01-03T10:30:00Z",
    "userId": 1,
    "reminderSent": false,
    "roadmap": "Step 1: Plan documentation structure..."
  }
]
```

---

### 9. Get Completed Tasks

**GET** `/completed`

Retrieve all completed tasks for the authenticated user.

#### Response
```json
[
  {
    "id": 2,
    "title": "Setup development environment",
    "description": "Install and configure development tools",
    "priority": "MEDIUM",
    "status": "COMPLETED",
    "dueDate": "2025-01-02T12:00:00Z",
    "createdAt": "2025-01-01T09:00:00Z",
    "updatedAt": "2025-01-02T11:30:00Z",
    "userId": 1,
    "reminderSent": true,
    "roadmap": "Step 1: Install Node.js..."
  }
]
```

---

### 10. Send Task Reminder

**POST** `/{id}/send-reminder`

Manually send a reminder email for a specific task.

#### Parameters
- `id` (path) - Task ID (integer)

#### Response
```json
{
  "message": "Reminder sent successfully"
}
```

#### Status Codes
- `200` - Reminder sent successfully
- `400` - Failed to send reminder
- `404` - Task not found

---

### 11. Send Task Reminder (Alternative)

**POST** `/send-reminder`

Send a reminder email for a task using request body.

#### Request Body
```json
{
  "taskId": 1
}
```

#### Response
```json
{
  "message": "Reminder sent successfully"
}
```

---

## Task Properties

### Priority Levels
- `HIGH` - High priority task
- `MEDIUM` - Medium priority task  
- `LOW` - Low priority task

### Status Types
- `PENDING` - Task is not completed
- `COMPLETED` - Task is completed

### Validation Rules

#### Title
- Required
- Maximum 100 characters

#### Description  
- Required
- Maximum 500 characters

#### Due Date
- Optional
- Must be in future (for new tasks)
- ISO 8601 format

#### Roadmap
- Optional
- Can contain AI-generated content
- Maximum 5000 characters

## Automatic Reminders

The system automatically sends email reminders for tasks:

- **24 hours before due date** - Initial reminder
- **12 hours before due date** - Follow-up reminder  
- **6 hours before due date** - Urgent reminder
- **1 hour before due date** - Critical reminder

Reminders are sent every 5 minutes by the backend scheduler.

## Error Codes

| Code | Description |
|------|-------------|
| 400 | Bad Request - Validation error |
| 401 | Unauthorized - Invalid or missing token |
| 403 | Forbidden - Access denied |
| 404 | Not Found - Task not found |
| 500 | Internal Server Error |