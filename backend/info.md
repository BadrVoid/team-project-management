# Team Project Management

## Project Overview

A full-stack team and project management application built with:

* Java 21
* Spring Boot
* Spring Data JPA
* PostgreSQL
* Spring Security
* JWT
* React
* Maven
* Docker

---

## Backend Progress

### Completed

* Database schema
* PostgreSQL setup
* ERD
* JPA entities
* BaseEntity
* Repositories
* Reports
* GlobalResponse
* Global exception handling
* Custom exceptions
* OTP system
* Authentication DTOs
* User DTOs
* Project DTOs
* Team DTOs
* Task DTOs
* Comment DTOs
* Member DTOs
* Notification DTO
* Space entity with owner
* OTP system for:

    * Email verification
    * Password reset
* OTP expiration
* OTP resend cooldown
* OTP maximum attempts
* OTP hashing
* OTP invalidation

---

## Global Response

All API responses will use:

```json
{
  "success": true,
  "message": "Operation successful",
  "data": {},
  "timestamp": "2026-09-07T22:00:00"
}
```

Errors will use:

```json
{
  "success": false,
  "message": "Something went wrong",
  "data": null,
  "timestamp": "2026-09-07T22:00:00"
}
```

HTTP status codes are handled separately using `ResponseEntity`.

---

## Exception Handling

Custom exceptions:

* `ResourceNotFoundException`
* `BadRequestException`
* `UnauthorizedException`
* `ForbiddenException`

Handled globally using:

```text
GlobalExceptionHandler
```

---

## OTP System

The project uses one OTP system instead of separate verification/reset token tables.

### OTP Types

```text
EMAIL_VERIFICATION
PASSWORD_RESET
```

### OTP Rules

* 6 digits
* Hashed before storing
* Expires after 5 minutes
* 60-second resend cooldown
* Maximum 5 verification attempts
* Previous active OTP is invalidated
* Uses `SecureRandom`

Email sending is **not implemented yet**.

---

## Database Structure

Main tables:

```text
users
spaces
projects
project_members
teams
team_members
tasks
task_comments
notifications
otps
```

### Main Relationships

```text
User
 ├── Spaces
 ├── Projects
 ├── Project Members
 ├── Team Members
 ├── Tasks
 ├── Task Comments
 ├── Notifications
 └── OTPs

Space
 └── Projects

Project
 ├── Project Members
 └── Teams

Team
 ├── Team Members
 └── Tasks

Task
 └── Task Comments
```

---

## Important Design Decisions

### Space Owner

Each space has an owner:

```text
spaces.owner_id → users.id
```

The owner should come from the authenticated user rather than being provided by the client.

### Project Creator

```text
projects.created_by → users.id
```

### Task Creator

```text
tasks.created_by → users.id
```

### Task Assignment

Tasks can optionally be assigned to a user:

```text
tasks.assigned_to → users.id
```

### Comments

Users can create comments on tasks.

Users should only be able to edit/delete their own comments.

---

## Backend Package Structure

```text
com.badr.teamprojectmanagement
│
├── auth
│   ├── RefreshToken.java
│   ├── RefreshTokenRepository.java
│   ├── dtos
│   └── otp
│
├── common
│   ├── entity
│   │   └── BaseEntity.java
│   ├── enums
│   └── response
│       └── GlobalResponse.java
│
├── exception
│   ├── BadRequestException.java
│   ├── ForbiddenException.java
│   ├── GlobalExceptionHandler.java
│   ├── ResourceNotFoundException.java
│   └── UnauthorizedException.java
│
├── notification
│
├── project
│
├── security
│
├── space
│
├── task
│
├── team
│
└── user
```

---

# Current Progress

```text
Database / Schema        ██████████ 100%
Entities                 ██████████ 100%
Repositories             ██████████ 100%
Reports                  ██████████ 100%
Global Response          ██████████ 100%
Exception Handling       ██████████ 100%
OTP Core                 ██████████ 100%
DTOs                     █████████░  90%
Services                 ░░░░░░░░░░   0%
Authentication / JWT     ░░░░░░░░░░   0%
Security Configuration   ░░░░░░░░░░   0%
Controllers              ░░░░░░░░░░   0%
Email Service            ░░░░░░░░░░   0%
API Testing              ░░░░░░░░░░   0%
Documentation             ░░░░░░░░░░   0%
Deployment                ░░░░░░░░░░   0%
```

> DTOs still need to be fully aligned with the final ERD before starting the Service layer.

---

# Next Steps

## 1. Fix and Align DTOs

Check these against the final entities/ERD:

* Project DTOs
* Team DTOs
* Task DTOs
* Notification DTO
* Project Member DTOs
* Team Member DTOs
* Space DTOs

Important fields such as:

```text
spaceId
projectId
teamId
createdBy
assignedTo
role
```

must match the actual database relationships.

---

## 2. Service Layer

Implement:

```text
UserService
UserServiceImpl

SpaceService
SpaceServiceImpl

ProjectService
ProjectServiceImpl

TeamService
TeamServiceImpl

TaskService
TaskServiceImpl

CommentService
CommentServiceImpl

NotificationService
NotificationServiceImpl

AuthService
AuthServiceImpl
```

Services will contain the main business logic.

---

## 3. Security

Implement:

* Spring Security configuration
* PasswordEncoder
* JWT generation
* JWT validation
* JWT filter
* Authentication
* Authorization
* Role-based access
* Refresh tokens

---

## 4. Authentication

Implement:

```text
Register
Login
Email Verification
Refresh Token
Forgot Password
Verify OTP
Reset Password
Change Password
Logout
```

---

## 5. Controllers

Create REST controllers for:

```text
Auth
User
Space
Project
Team
Task
Comment
Notification
```

---

## 6. API Testing

Test all endpoints using:

* Postman
* Swagger/OpenAPI

Test:

* Success responses
* Validation errors
* Authentication
* Authorization
* Not found
* Bad requests
* Expired JWT
* OTP expiration
* OTP attempts
* OTP cooldown

---

## 7. Frontend Integration

Connect the React frontend to the Spring Boot API.

Implement:

* Authentication
* JWT handling
* API services
* Projects
* Teams
* Tasks
* Comments
* Notifications
* Spaces
* User profile

---

## 8. Docker & Deployment

Finalize:

```text
Frontend
Backend
PostgreSQL
```

using Docker/Docker Compose, then deploy the application.

---

# Today's Status

**Database foundation is complete.**

The next development phase is:

```text
DTO Alignment
      ↓
Services
      ↓
Security / JWT
      ↓
Authentication
      ↓
Controllers
      ↓
API Testing
      ↓
Frontend Integration
      ↓
Deployment
```
