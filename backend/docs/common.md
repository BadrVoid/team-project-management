````md
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

```
```
