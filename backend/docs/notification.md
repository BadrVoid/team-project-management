````md
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

