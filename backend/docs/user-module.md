````md
# User Module

## Overview

The User module is responsible for managing application users and their profile information.

Users are the main entities in the system. Projects, teams, tasks, comments, notifications, authentication tokens, and other modules are connected to users.

---

## Package

```text
com.badr.teamprojectmanagement.user
````

---

## Main Entities

### User

The `User` entity represents an application account.

Main responsibilities:

* Store account information.
* Store authentication-related information.
* Store user role.
* Track account status.
* Connect the user with projects, teams, tasks, comments, notifications, OTPs, and refresh tokens.

All user IDs are UUIDs.

---

### UserProfile

The `UserProfile` entity contains additional information about a user.

It is separated from the main `User` entity so that account information and profile information are not tightly coupled.

A profile can contain information such as:

* First name
* Last name
* Bio
* Profile image
* Skills
* Tags

---

### UserProfileSkill

Represents a skill associated with a user profile.

Relationship:

```text
UserProfile 1 ─── * UserProfileSkill
```

---

### UserProfileTag

Represents a tag associated with a user profile.

Relationship:

```text
UserProfile 1 ─── * UserProfileTag
```

---

## Roles

The system currently supports:

```text
USER
ADMIN
```

### USER

Normal application user.

A normal user can:

* Create and manage their own account.
* Join projects.
* Join teams.
* Create and manage tasks according to permissions.
* Add task comments.
* Receive notifications.

### ADMIN

System administrator.

The administrator has higher-level permissions for managing the application.

---

## Repository

Main repository:

```java
UserRepository
```

Important operations include:

```java
findByEmail(...)
findById(...)
existsByEmail(...)
```

---

## Relationships

```text
User
 ├── UserProfile
 ├── ProjectMember
 ├── ProjectJoinRequest
 ├── TeamMember
 ├── TeamJoinRequest
 ├── Task.assignedTo
 ├── Task.createdBy
 ├── TaskComment
 ├── Notification
 ├── RefreshToken
 └── Otp
```

---

## Security

The authenticated user is available in controllers using:

```java
@AuthenticationPrincipal User user
```

The user's ID is then passed to the service layer:

```java
user.getId()
```

This prevents controllers from trusting a user ID supplied by the client for current-user operations.

---

## Design Rules

* Use UUID for user IDs.
* Keep authentication data inside `User`.
* Keep additional profile information inside `UserProfile`.
* Use DTOs for API responses.
* Do not expose the entire `User` entity directly from controllers.
* Use the authenticated principal for current-user operations.

````

---

## `auth.md`

```md
# Authentication Module

## Overview

The Authentication module handles user registration, login, JWT authentication, refresh tokens, OTP verification, password changes, and password reset.

---

## Package

```text
com.badr.teamprojectmanagement.auth
````

---

## Main Components

### Register

Users can create an account through the registration flow.

The registration process creates the user and starts the email verification process.

---

### Login

The login process verifies:

1. Email
2. Password
3. Account verification status
4. Account status

After successful authentication, the backend returns:

* Access token
* Refresh token
* User information

---

## JWT

The application uses JWT for stateless authentication.

Configuration:

```properties
jwt.secret=${JWT_SECRET}
jwt.expiration=900000
```

The access token expiration is:

```text
15 minutes
```

The JWT secret is provided through the environment variable:

```text
JWT_SECRET
```

The secret should never be committed to Git.

---

## JWT Authentication Flow

```text
Client
   │
   │ Login
   ▼
Auth Controller
   │
   ▼
Auth Service
   │
   ├── Validate credentials
   ├── Validate account
   └── Generate JWT
   │
   ▼
Access Token
   │
   ▼
Client
```

For protected requests:

```text
Client
   │
   │ Authorization: Bearer <JWT>
   ▼
JwtAuthenticationFilter
   │
   ├── Extract token
   ├── Validate token
   ├── Extract user information
   └── Load User
   │
   ▼
SecurityContext
   │
   ▼
Controller
```

---

## Refresh Token

Refresh tokens are stored in the database.

Entity:

```text
RefreshToken
```

Relationship:

```text
User 1 ─── * RefreshToken
```

The refresh token allows the client to obtain a new access token without logging in again.

Current intended lifetime:

```text
Access Token: 15 minutes
Refresh Token: 7 days
```

---

## OTP

The OTP system is used for account verification and password-related flows.

Entity:

```text
Otp
```

The OTP implementation uses:

```text
Expiry: 5 minutes
Resend cooldown: 60 seconds
Maximum attempts: 5
```

OTP values are stored as BCrypt hashes rather than plain text.

---

## OTP Flow

```text
User
 │
 │ Request OTP
 ▼
OtpService
 │
 ├── Generate OTP
 ├── Hash OTP
 ├── Store OTP
 └── Send OTP
 │
 ▼
User receives OTP
 │
 │ Submit OTP
 ▼
Verify OTP
 │
 ├── Check expiration
 ├── Check attempts
 ├── Compare hash
 └── Mark OTP as used
```

Previous active OTPs are invalidated when a new OTP is generated.

---

## Password Operations

The authentication module supports:

### Change Password

Authenticated users can change their password.

### Forgot Password

Users can request a password reset.

### Reset Password

The user verifies the required OTP and sets a new password.

---

## Security

Passwords are hashed using:

```java
BCryptPasswordEncoder
```

Passwords are never stored as plain text.

---

## Authentication Endpoints

The authentication API is grouped under:

```text
/api/auth
```

Examples include:

```text
POST /api/auth/register
POST /api/auth/login
POST /api/auth/verify-otp
POST /api/auth/resend-otp
POST /api/auth/refresh
POST /api/auth/change-password
POST /api/auth/forgot-password
POST /api/auth/reset-password
```

The exact DTO/request fields should be checked against the current controller implementation.

---

## Security Rules

Public endpoints include:

```text
/api/auth/**
/swagger-ui/**
/swagger-ui.html
/v3/api-docs/**
```

Other API endpoints require authentication.

---

## Important Rules

* Never hard-code `JWT_SECRET`.
* Never store plain passwords.
* Never store plain OTP values.
* Access tokens are short-lived.
* Refresh tokens are stored and managed separately.
* Protected endpoints use JWT authentication.
* Current-user operations should use `@AuthenticationPrincipal`.

````

---

# `space.md`

```md
# Space Module

## Overview

A Space is a higher-level container used to organize projects.

The current architecture allows a user to own a space and create projects inside it.

---

## Package

```text
com.badr.teamprojectmanagement.space
````

---

## Entity

### Space

The `Space` entity represents a workspace/container for projects.

Important relationship:

```text
User 1 ─── * Space
```

The owner is stored using:

```text
spaces.owner_id
```

---

## Relationship With Projects

```text
Space 1 ─── * Project
```

Each project belongs to a space.

Database relationship:

```text
projects.space_id → spaces.id
```

---

## Ownership

Every space has an owner.

The owner is a `User`.

```text
Space
 └── owner → User
```

The owner relationship is important for authorization and future space-level management.

---

## Responsibilities

The Space module is responsible for:

* Creating spaces.
* Updating spaces.
* Retrieving spaces.
* Deleting spaces when allowed.
* Managing the relationship between spaces and their projects.
* Enforcing space ownership rules.

---

## Architecture

```text
space/
├── Space.java
├── SpaceRepository.java
├── controller/
├── dtos/
└── service/
```

---

## Design Rules

* Every space has an owner.
* A space can contain multiple projects.
* Projects reference their parent space.
* Authorization should be based on the authenticated user.
* Use DTOs instead of exposing JPA entities directly.

````

---

# `project.md`

```md
# Project Module

## Overview

The Project module manages projects, project members, project roles, project membership, and project join/invitation flows.

A project belongs to a Space and is created by a User.

---

## Package

```text
com.badr.teamprojectmanagement.project
````

---

## Main Entities

### Project

Represents a project inside a space.

Relationships:

```text
Project → Space
Project → User (createdBy)
Project → ProjectMember
Project → ProjectJoinRequest
Project → Team
```

Database relationships:

```text
projects.space_id → spaces.id
projects.created_by → users.id
```

---

## Project Status

The system supports:

```text
PLANNING
ACTIVE
COMPLETED
ARCHIVED
```

---

## Project Members

Entity:

```text
ProjectMember
```

A project member connects a User with a Project.

```text
Project 1 ─── * ProjectMember
User    1 ─── * ProjectMember
```

---

## Project Member Roles

```text
OWNER
MANAGER
MEMBER
```

### OWNER

The project owner has the highest project-level permissions.

### MANAGER

Managers can perform management operations such as:

* View join requests.
* Accept join requests.
* Reject join requests.
* Invite users.

### MEMBER

Normal project member.

Members can access project functionality according to the permissions of each module.

---

## Membership Status

Project membership supports:

```text
PENDING
ACCEPTED
REJECTED
```

---

# Project Join Requests

Entity:

```text
ProjectJoinRequest
```

This entity supports two flows:

```text
1. User requests to join a project
2. Project manager invites a user
```

---

## Join Request Flow

A user can request to join a project.

```text
User
 │
 │ Send join request
 ▼
ProjectJoinRequest
 │
 │ Pending
 ▼
Project OWNER/MANAGER
 │
 ├── Accept
 │      │
 │      ▼
 │   ProjectMember
 │
 └── Reject
```

---

## Invitation Flow

An owner or manager can invite a user.

```text
OWNER/MANAGER
 │
 │ Invite user
 ▼
ProjectJoinRequest
 │
 │ Pending
 ▼
Notification
 │
 ▼
Invited User
 │
 ├── Accept
 │      │
 │      ▼
 │   ProjectMember
 │
 └── Reject
```

---

## Authorization

Only project:

```text
OWNER
MANAGER
```

can:

* View project join requests.
* Accept join requests.
* Reject join requests.
* Send project invitations.

The invited user alone can:

* Accept their invitation.
* Reject their invitation.

Authorization is checked using the authenticated user's ID.

---

## Project Join Request Endpoints

Base path:

```text
/api/project-join-requests
```

Main endpoints:

```text
POST   /project/{projectId}

GET    /project/{projectId}

PATCH  /{requestId}/accept

PATCH  /{requestId}/reject

POST   /project/{projectId}/invite/{userId}

GET    /my-invitations

PATCH  /{requestId}/accept-invitation

PATCH  /{requestId}/reject-invitation
```

---

## Project Details

The project details response can include:

```text
Project
 ├── createdBy
 ├── members
 └── teams
```

Example structure:

```text
ProjectDetailsResponse
 ├── id
 ├── name
 ├── description
 ├── status
 ├── startDate
 ├── endDate
 ├── createdBy
 ├── members
 └── teams
```

---

## Important Rule

A user must become a project member before becoming a member of one of its teams.

```text
User
  │
  ▼
Project Membership
  │
  ▼
Team Membership
```

This prevents users from directly joining a team without belonging to its project.

````

---

# `team.md`

```md
# Team Module

## Overview

The Team module manages teams inside projects and controls team membership, team roles, join requests, and invitations.

A team always belongs to a project.

---

## Package

```text
com.badr.teamprojectmanagement.team
````

---

## Main Entities

### Team

Represents a team inside a project.

Relationship:

```text
Project 1 ─── * Team
```

Database relationship:

```text
teams.project_id → projects.id
```

Team names are unique within the same project.

---

### TeamMember

Connects a User with a Team.

```text
Team 1 ─── * TeamMember
User 1 ─── * TeamMember
```

---

## Team Roles

```text
LEADER
MEMBER
```

### LEADER

The team leader can manage team membership operations.

Current management permissions include:

* View join requests.
* Accept join requests.
* Reject join requests.
* Invite users.

### MEMBER

Normal team member.

---

# Team Join Requests

Entity:

```text
TeamJoinRequest
```

The entity supports:

* User join requests.
* Team invitations.

---

## Join Request Flow

```text
User
 │
 │ Request to join team
 ▼
TeamJoinRequest
 │
 │ Pending
 ▼
Team Leader
 │
 ├── Accept
 │      │
 │      ▼
 │   TeamMember
 │
 └── Reject
```

---

## Invitation Flow

```text
Team Leader
 │
 │ Invite user
 ▼
TeamJoinRequest
 │
 │ Pending
 ▼
Notification
 │
 ▼
Invited User
 │
 ├── Accept
 │      │
 │      ▼
 │   TeamMember
 │
 └── Reject
```

---

## Authorization

Only a team `LEADER` can:

```text
View requests
Accept requests
Reject requests
Invite users
```

The invited user can only process their own invitation.

---

## Team Join Request Endpoints

Base path:

```text
/api/team-join-requests
```

Endpoints:

```text
POST   /team/{teamId}

GET    /team/{teamId}

PATCH  /{requestId}/accept

PATCH  /{requestId}/reject

POST   /team/{teamId}/invite/{userId}

GET    /my-invitations

PATCH  /{requestId}/accept-invitation

PATCH  /{requestId}/reject-invitation
```

---

## Important Membership Rule

A user should already be a project member before joining a team.

Expected flow:

```text
User
 │
 ▼
Project
 │
 │ Accepted
 ▼
ProjectMember
 │
 ▼
Team
 │
 │ Accepted
 ▼
TeamMember
```

---

## Team Member Management

The existing Team Member module supports:

* Adding a member.
* Getting team members.
* Updating member roles.
* Removing members.

However, the preferred user-facing membership flow is now:

```text
Request
OR
Invitation
```

instead of directly adding users.

---

## Future Improvement

The current `TeamJoinRequest` status is:

```text
PENDING
ACCEPTED
REJECTED
```

The same entity is used for both requests and invitations.

A future improvement would be adding a type:

```text
REQUEST
INVITATION
```

This would allow the backend to explicitly distinguish between the two flows.

````

---

# `task.md`

```md
# Task Module

## Overview

The Task module manages work items inside teams.

Every task belongs to a team and can be assigned to a team member.

---

## Package

```text
com.badr.teamprojectmanagement.task
````

---

## Entity

### Task

A task contains information about work that needs to be completed.

Main relationships:

```text
Task → Team
Task → User (assignedTo)
Task → User (createdBy)
Task → TaskComment
```

---

## Task Fields

Main task information includes:

```text
id
team
title
description
status
priority
dueDate
assignedTo
createdBy
createdAt
updatedAt
```

---

## Task Status

```text
TODO
IN_PROGRESS
IN_REVIEW
COMPLETED
```

---

## Task Priority

```text
LOW
MEDIUM
HIGH
URGENT
```

---

# Task Creation

A user must be a member of the task's team to create a task.

The assigned user must also belong to the same team.

Flow:

```text
User
 │
 │ Create task
 ▼
Check Team Membership
 │
 ▼
Validate Assigned User
 │
 ▼
Create Task
```

---

# Task Assignment

A task can be assigned to a team member.

When a task is assigned, the assigned user receives:

```text
TASK_ASSIGNED
```

notification.

---

# Task Updates

Task updates can include:

* Title
* Description
* Status
* Priority
* Due date
* Assigned user

When the assigned user changes, the new assignee receives a task assignment notification.

If the assigned task is updated without changing the assignee, the assigned user can receive:

```text
TASK_UPDATED
```

notification.

---

# Task Authorization

Current task management rules allow:

### Creator

Can manage their created tasks.

### Assigned User

Can manage tasks assigned to them according to the service rules.

### Team Leader

Can manage team tasks.

---

# Task Deletion

Deleting a task is restricted to authorized users.

The current authorization allows:

```text
Task Creator
OR
Team Leader
```

to delete a task.

---

# Task Comments

Tasks can have multiple comments.

Relationship:

```text
Task 1 ─── * TaskComment
```

---

# Notifications

Task events can create notifications:

```text
TASK_ASSIGNED
TASK_UPDATED
TASK_COMMENTED
```

---

## Important Rules

* A task belongs to exactly one team.
* The creator must have access to the team.
* The assigned user must belong to the same team.
* Task access is controlled through team membership and role.
* Use DTOs for API communication.
* Do not expose JPA entities directly from controllers.

````

---

# `task-comments.md`

```md
# Task Comments Module

## Overview

The Task Comments module allows team members to discuss tasks.

Each comment belongs to one task and is created by one user.

---

## Package

```text
com.badr.teamprojectmanagement.task
````

---

## Entity

### TaskComment

Relationships:

```text
Task 1 ─── * TaskComment
User 1 ─── * TaskComment
```

Each comment contains:

```text
id
task
user
content
createdAt
updatedAt
```

---

# Access Control

A user must have access to the task's team to work with its comments.

Team membership is checked before comment operations.

---

# Create Comment

Flow:

```text
User
 │
 ▼
Check Team Membership
 │
 ▼
Create Comment
 │
 ▼
Save Comment
 │
 ▼
Create Notifications
```

---

# Update Comment

A user can edit their own comment.

The comment owner is checked before allowing the update.

---

# Delete Comment

A comment can be deleted by:

```text
Comment Owner
OR
Team Leader
```

---

# Comment Notifications

When a user comments on a task, relevant users can receive:

```text
TASK_COMMENTED
```

The notification can be sent to:

* Task creator
* Assigned user

The commenter does not receive their own notification.

---

## Notification Example

If user A comments on a task created by user B:

```text
User A
 │
 │ Comment
 ▼
TaskComment
 │
 ▼
Notify User B
```

If the task is assigned to user C:

```text
User A
 │
 │ Comment
 ▼
TaskComment
 │
 ├── Notify User B
 └── Notify User C
```

The system avoids sending duplicate/self notifications where appropriate.

---

## Important Rules

* User must belong to the task's team.
* Users can edit their own comments.
* Team leaders can delete comments.
* Notifications are generated for relevant task participants.

````

---

# `notification.md`

```md
# Notification Module

## Overview

The Notification module provides in-app notifications for important events in the system.

Notifications are connected to users.

---

## Package

```text
com.badr.teamprojectmanagement.notification
````

---

## Entity

### Notification

Relationship:

```text
User 1 ─── * Notification
```

A notification belongs to one user.

---

## Notification Types

The system currently supports:

```text
TASK_ASSIGNED
TASK_UPDATED
TASK_COMMENTED
PROJECT_INVITATION
TEAM_INVITATION
SYSTEM
```

---

## Notification Creation

Notifications are created by services when important events happen.

Examples:

### Task Assignment

```text
TASK_ASSIGNED
```

Created when a user is assigned a task.

### Task Update

```text
TASK_UPDATED
```

Created when an assigned task is updated.

### Task Comment

```text
TASK_COMMENTED
```

Created when another user comments on a relevant task.

### Project Invitation

```text
PROJECT_INVITATION
```

Created when a user is invited to a project.

### Team Invitation

```text
TEAM_INVITATION
```

Created when a user is invited to a team.

---

# Notification Operations

The Notification service supports:

```text
Create notification
Get my notifications
Get my unread notifications
Get unread count
Mark notification as read
Mark all notifications as read
Delete notification
```

---

## User Notifications

Users can retrieve all their notifications.

```text
User
 │
 ▼
NotificationService
 │
 ▼
User's Notifications
```

---

## Unread Notifications

The system supports retrieving only unread notifications.

It also supports an unread count.

Example:

```text
Unread count = 5
```

This can be used by the frontend for a notification badge.

---

# Mark As Read

A user can mark one notification as read.

The service verifies that the notification belongs to the current user.

---

# Mark All As Read

The user can mark all their notifications as read.

Only the authenticated user's notifications should be affected.

---

# Delete Notification

A user can delete their own notification.

The service checks notification ownership before deletion.

---

## Integration

The Notification module is used by:

```text
Task Module
Task Comment Module
Project Join Request Module
Team Join Request Module
```

---

## Design Rules

* Notifications belong to users.
* Users can only manage their own notifications.
* Notification creation should happen inside business services.
* Controllers should not manually create notification entities.
* Use `NotificationService` for notification creation.

````

---

# `common.md`

```md
# Common Module

## Overview

The Common module contains shared components used throughout the backend.

---

## Package

```text
com.badr.teamprojectmanagement.common
````

---

# BaseEntity

The application uses a common base entity for database entities.

Main fields:

```text
id
createdAt
updatedAt
```

The ID type is:

```text
UUID
```

---

## UUID

All main entities use UUID identifiers.

Example:

```text
550e8400-e29b-41d4-a716-446655440000
```

Using UUIDs avoids relying on sequential database IDs.

---

# GlobalResponse

The API uses a common response wrapper:

```text
GlobalResponse<T>
```

The response contains:

```text
success
message
data
timestamp
```

Example:

```json
{
  "success": true,
  "message": "Project retrieved successfully",
  "data": {},
  "timestamp": "2026-09-10T12:00:00"
}
```

---

# DTO Pattern

Controllers communicate using DTOs rather than directly exposing entities.

The architecture is:

```text
Controller
    │
    ▼
DTO
    │
    ▼
Service
    │
    ▼
Entity
    │
    ▼
Repository
```

Services return DTOs to controllers.

Controllers wrap them using:

```text
GlobalResponse<T>
```

---

# Enums

Common business enums are stored under:

```text
common/enums
```

Examples include:

```text
ProjectStatus
ProjectMemberRole
MembershipStatus
TeamMemberRole
JoinRequestStatus
TeamJoinRequestStatus
TaskStatus
TaskPriority
NotificationType
```

---

# Exception Handling

The application uses custom exceptions such as:

```text
BadRequestException
ResourceNotFoundException
```

A global exception handler is responsible for converting exceptions into consistent API responses.

---

# Validation

Request DTOs use Jakarta Validation where required.

Examples include validations for:

```text
Required fields
String length
Email format
Valid values
```

---

# Transaction Management

Service operations use Spring transactions.

Typical service configuration:

```java
@Transactional
```

Read-only operations can use:

```java
@Transactional(readOnly = true)
```

This keeps database operations consistent and clearly separates read and write operations.

---

# Architecture Rules

The backend follows these main rules:

1. Controllers handle HTTP requests and responses.
2. Services contain business logic.
3. Repositories handle database access.
4. Entities represent database tables.
5. DTOs represent API input/output.
6. Controllers return `GlobalResponse<T>`.
7. Services return DTOs.
8. Current-user operations use `@AuthenticationPrincipal`.
9. Authorization belongs in the service/business layer.
10. IDs use UUID.

````

---

### Recommended `docs/modules` folder

```text
docs/
└── modules/
    ├── auth.md
    ├── common.md
    ├── notification.md
    ├── project.md
    ├── space.md
    ├── task.md
    ├── task-comments.md
    ├── team.md
    └── user.md
````

These docs cover the modules we've worked through so far, including the **request/invitation authorization flow** we just finished.
