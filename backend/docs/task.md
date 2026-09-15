````md
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

```
```
