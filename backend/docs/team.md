````md
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

```
```
