````md
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

```
```
