````md
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

```
```
