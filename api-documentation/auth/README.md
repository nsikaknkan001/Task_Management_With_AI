# Authentication API

Base URL: `http://localhost:8080/api/auth`

## Endpoints

### 1. User Registration

**POST** `/register`

Register a new user account.

#### Request Body
```json
{
  "username": "string (3-50 chars, required)",
  "email": "string (valid email, required)",
  "password": "string (min 8 chars, 1 uppercase, 1 symbol, required)"
}
```

#### Response
```json
{
  "user": {
    "id": 1,
    "username": "johndoe",
    "email": "john@example.com",
    "createdAt": "2025-01-03T10:30:00Z"
  },
  "token": "VERIFICATION_REQUIRED"
}
```

#### Status Codes
- `200` - Registration successful, verification required
- `400` - Validation error or user already exists

---

### 2. Email Verification

**POST** `/verify-email`

Verify user email with 4-digit code.

#### Request Body
```json
{
  "email": "john@example.com",
  "verificationCode": "1234"
}
```

#### Response
```json
{
  "user": {
    "id": 1,
    "username": "johndoe",
    "email": "john@example.com",
    "createdAt": "2025-01-03T10:30:00Z"
  },
  "token": "eyJhbGciOiJIUzUxMiJ9..."
}
```

#### Status Codes
- `200` - Email verified successfully
- `400` - Invalid or expired verification code

---

### 3. User Login

**POST** `/login`

Authenticate user and get JWT token.

#### Request Body
```json
{
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```

#### Response
```json
{
  "user": {
    "id": 1,
    "username": "johndoe",
    "email": "john@example.com",
    "createdAt": "2025-01-03T10:30:00Z"
  },
  "token": "eyJhbGciOiJIUzUxMiJ9..."
}
```

#### Status Codes
- `200` - Login successful
- `400` - Invalid credentials or email not verified

---

### 4. Resend Verification Code

**POST** `/resend-code`

Resend email verification code.

#### Request Body
```json
{
  "email": "john@example.com"
}
```

#### Response
```json
{
  "message": "Verification code sent successfully"
}
```

#### Status Codes
- `200` - Code sent successfully
- `400` - Email already verified or user not found

---

## Password Requirements

- Minimum 8 characters
- At least 1 uppercase letter (A-Z)
- At least 1 special character (!@#$%^&*(),.?":{}|<>)

## JWT Token

- Expires in 5 hours
- Include in Authorization header: `Bearer <token>`
- Required for all protected endpoints

## Email Verification

- 4-digit numeric code
- Expires in 10 minutes
- Sent via Gmail SMTP
- Required before login

## Error Codes

| Code | Description |
|------|-------------|
| 400 | Bad Request - Validation error |
| 401 | Unauthorized - Invalid credentials |
| 409 | Conflict - User already exists |
| 500 | Internal Server Error |