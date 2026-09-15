# Space Module

The Space module manages spaces owned by users.

A **Space** is a top-level container that can contain multiple projects.

---

## Package Structure

```text
space/
├── Space.java
├── SpaceRepository.java
├── controller/
│   └── SpaceController.java
├── dtos/
│   ├── SpaceCreateRequest.java
│   ├── SpaceResponse.java
│   └── SpaceUpdateRequest.java
└── service/
    ├── SpaceService.java
    └── SpaceServiceImpl.java
```

---

## Entity

### `Space`

The `Space` entity represents a workspace owned by a user.

Main fields:

```text
id
name
description
owner
createdAt
updatedAt
```

Relationship:

```text
User 1 ─────── * Space
```

Each space has exactly one owner.

---

## Repository

### `SpaceRepository`

The repository provides database access for spaces.

Main operation:

```java
List<Space> findByOwner(User owner);
```

This is used to retrieve all spaces belonging to a specific user.

---

## DTOs

### `SpaceCreateRequest`

Used when creating a space.

```text
name
description
```

The owner is **not provided by the client**.

The owner is taken from the authenticated user.

---

### `SpaceUpdateRequest`

Used when updating a space.

```text
name
description
```

---

### `SpaceResponse`

Returned by the API.

```text
id
name
description
ownerId
```

---

## Service

### `SpaceService`

```java
public interface SpaceService {

    SpaceResponse createSpace(
            UUID ownerId,
            SpaceCreateRequest request
    );

    SpaceResponse getSpaceById(
            UUID id
    );

    List<SpaceResponse> getSpacesByOwner(
            UUID ownerId
    );

    SpaceResponse updateSpace(
            UUID id,
            UUID ownerId,
            SpaceUpdateRequest request
    );

    void deleteSpace(
            UUID id,
            UUID ownerId
    );
}
```

---

## Business Rules

### Create Space

The authenticated user becomes the owner.

Flow:

```text
Authenticated User
       ↓
Create Space
       ↓
User becomes owner
       ↓
Space saved
```

The client cannot choose another owner.

---

### Get My Spaces

Users can retrieve the spaces they own.

```text
GET /api/spaces/my
```

The owner ID comes from the authenticated user.

---

### Get Space

A space can be retrieved using its ID.

```text
GET /api/spaces/{id}
```

The service checks that the space exists.

---

### Update Space

Only the space owner can update it.

Flow:

```text
Request
   ↓
Find Space
   ↓
Check authenticated user == space owner
   ↓
Update
   ↓
Save
```

If another user tries to update the space:

```text
403 Forbidden
```

---

### Delete Space

Only the space owner can delete it.

Flow:

```text
Request
   ↓
Find Space
   ↓
Check authenticated user == space owner
   ↓
Delete
```

If another user tries to delete it:

```text
403 Forbidden
```

---

## Authorization

| Operation       | Permission         |
| --------------- | ------------------ |
| Create space    | Authenticated user |
| Get own spaces  | Authenticated user |
| Get space by ID | Authenticated user |
| Update space    | Owner only         |
| Delete space    | Owner only         |

The owner check is performed inside the service layer.

Example:

```java
if (!space.getOwner().getId().equals(ownerId)) {
    throw new ForbiddenException(
            "You are not allowed to update this space"
    );
}
```

This prevents users from modifying spaces they do not own.

---

## Controller

### Base URL

```text
/api/spaces
```

### Endpoints

#### Create Space

```http
POST /api/spaces
```

Request:

```json
{
  "name": "My Space",
  "description": "My workspace"
}
```

The authenticated user becomes the owner.

Response:

```text
201 Created
```

---

#### Get My Spaces

```http
GET /api/spaces/my
```

Returns spaces owned by the authenticated user.

---

#### Get Space

```http
GET /api/spaces/{id}
```

Returns a specific space.

---

#### Update Space

```http
PUT /api/spaces/{id}
```

Request:

```json
{
  "name": "Updated Space",
  "description": "Updated description"
}
```

Only the owner can perform this operation.

---

#### Delete Space

```http
DELETE /api/spaces/{id}
```

Only the owner can perform this operation.

Response:

```text
204 No Content
```

---

## Global Response

Controllers return:

```java
GlobalResponse<T>
```

Example:

```json
{
  "success": true,
  "message": "Space created successfully",
  "data": {
    "id": "uuid",
    "name": "My Space",
    "description": "My workspace",
    "ownerId": "uuid"
  },
  "timestamp": "..."
}
```

---

## Exception Handling

The Space module uses the global exception handler.

Possible exceptions:

### Space Not Found

```java
throw new ResourceNotFoundException(
        "Space not found"
);
```

Returns:

```text
404 Not Found
```

### User Not Found

```java
throw new ResourceNotFoundException(
        "User not found"
);
```

Returns:

```text
404 Not Found
```

### Unauthorized Space Modification

```java
throw new ForbiddenException(
        "You are not allowed to update this space"
);
```

or:

```java
throw new ForbiddenException(
        "You are not allowed to delete this space"
);
```

Returns:

```text
403 Forbidden
```

---

## Relationship With Projects

A Space can contain multiple projects.

```text
User
 │
 └── Space
      │
      ├── Project
      ├── Project
      └── Project
```

Database relationship:

```text
spaces.owner_id → users.id

projects.space_id → spaces.id
```

Therefore:

```text
User
  ↓
Space
  ↓
Project
  ↓
Project Members
  ↓
Teams
  ↓
Tasks
```

---

## Security Notes

The authenticated user is obtained using:

```java
@AuthenticationPrincipal User user
```

The controller passes:

```java
user.getId()
```

to the service.

The service is responsible for checking ownership before sensitive operations.

This prevents relying only on frontend restrictions.

---

## Current Status

The Space module is **complete** with:

* Space entity
* Space repository
* Create space
* Get space
* Get user's spaces
* Update space
* Delete space
* Owner authorization
* DTOs
* Global response
* Exception handling
* REST controller

### Status

```text
Space Module: ✅ Complete
```
