Authentication & Authorization

1. Authentication

Authentication answers:

"Who is this user?"

The system supports:



Register

Login

Email verification with OTP

Forgot password

Reset password

Change password

JWT Access Token

JWT Refresh Token

Google OAuth

GitHub OAuth

BCrypt password hashing

Remember Me

Protected API endpoints

JWT

The access token contains:



userId

email / sub

role



Access token lifetime:



15 minutes



Refresh token lifetime:



7 days

2. User Roles

The system has two main application roles:

ADMIN
USER


ADMIN

Administrators have global management permissions.

ADMIN
├── Manage users
├── Manage spaces
├── Manage projects
├── Manage teams
└── Bypass normal ownership restrictions


Admin permissions are checked before normal owner/manager permissions.

3. Authorization

Authorization answers:

"What is this user allowed to do?"

Permissions depend on:



Global user role

Resource ownership

Membership

Membership role

Resource visibility

Request status

4. Space Authorization

A Space contains:

Space
├── Projects
├── Teams
├── Members
└── Join Requests


A Space has:

Visibility:
PUBLIC
PRIVATE


Space Roles

OWNER
MEMBER


OWNER

The Space owner can:



View the space

Update the space

Delete the space

View pending join requests

Accept join requests

Reject join requests

MEMBER

A Space member can:



View the space

Access resources they are allowed to access

Request/access projects and teams according to their permissions



A normal member cannot:



Update the Space

Delete the Space

Accept join requests

Reject join requests

Manage Space membership

5. Space Visibility

PUBLIC

Anyone can discover the Space.

PUBLIC SPACE
│
├── Non-member → Can view
│                 Can request to join
│
├── MEMBER → Can view
│
└── OWNER → Full management


PRIVATE

A private Space is not publicly joinable.

PRIVATE SPACE
│
├── ADMIN → Access
├── OWNER → Access
├── MEMBER → Access
└── OTHER USER → Forbidden


Knowing the Space UUID is not enough to access a private Space.

6. Space Join Request Flow

A user can request to join a PUBLIC Space.

User
│
│ Join Space
▼
SpaceJoinRequest
│
▼
PENDING


The Space owner can then:

PENDING
│
├── ACCEPT
│      ↓
│   SpaceMember
│   role = MEMBER
│
└── REJECT
↓
REJECTED


Request Status

PENDING
ACCEPTED
REJECTED


PENDING

The request is waiting for the Space owner/admin.



The user cannot create another pending request.

ACCEPTED

The user becomes:

SpaceMember
role = MEMBER


REJECTED

The user is not added to the Space.



They can request again later.

7. Space Join Request Permissions

ActionADMINOWNERMEMBERNON-MEMBER

View Space

Yes

Yes

Yes

Public only

Update Space

Yes

Yes

No

No

Delete Space

Yes

Yes

No

No

View Join Requests

Yes

Yes

No

No

Accept Request

Yes

Yes

No

No

Reject Request

Yes

Yes

No

No

Request to Join Public Space

Yes

N/A

Already member

Yes

8. Project Authorization

Projects belong to a Space.

Space
│
└── Project
├── Members
└── Teams


Project member roles:

OWNER
MANAGER
MEMBER


Project OWNER

The Project owner can:



View project

Update project

Delete project

Invite members

Modify members

Remove members

Promote members

Create teams

Update teams

Delete teams



The owner cannot be removed from the project.

Project MANAGER

A Manager can:



View project

Update project

Invite members

Remove non-owner members

Create teams

Update teams

Delete teams



A Manager cannot:



Delete the project

Modify the OWNER

Promote someone to OWNER

Remove the OWNER

Project MEMBER

A Member can:



View the project

Access permitted project resources



A Member cannot:



Update project

Delete project

Manage project members

Create teams

Update teams

Delete teams

9. Project Permissions

ActionADMINOWNERMANAGERMEMBER

View Project

Yes

Yes

Yes

Yes

Update Project

Yes

Yes

Yes

No

Delete Project

Yes

Yes

No

No

Invite Member

Yes

Yes

Yes

No

Modify Member

Yes

Yes

Limited

No

Remove Member

Yes

Yes

Yes*

No

Promote to OWNER

Yes

Yes

No

No

Create Team

Yes

Yes

Yes

No

Update Team

Yes

Yes

Yes

No

Delete Team

Yes

Yes

Yes

No

* Manager cannot remove the Project OWNER.

10. Project Member Invitations

Project invitations are controlled by:

ADMIN
OWNER
MANAGER


A normal MEMBER cannot invite users.



A Manager cannot:

MANAGER
│
└── Promote MEMBER → OWNER ❌


Only the Owner/Admin can perform owner-level membership changes.

11. Team Authorization

Teams belong to Projects.

Space
│
└── Project
│
└── Team
└── Members


Team roles:

LEADER
MEMBER


Team Leader

The Team Leader can:



View team

Add members

Change member membership where allowed

Remove members



The Team Leader does not automatically have Project management permissions.



For example:

TEAM LEADER
│
├── Manage team members → Yes
│
├── Update Project → No
├── Delete Project → No
└── Delete Team → No


Team Member

A normal Team Member can:



View the team

Access allowed team resources



A Team Member cannot manage other members.

Team CRUD

Team creation/update/deletion is controlled by the Project authorization layer:

ADMIN
↓
OWNER
↓
MANAGER


A Team Leader does not automatically gain Team CRUD permissions.

12. Team Member Permissions

ActionADMINPROJECT OWNERPROJECT MANAGERTEAM LEADERTEAM MEMBER

View Team

Yes

Yes

Yes

Yes

Yes

Create Team

Yes

Yes

Yes

No

No

Update Team

Yes

Yes

Yes

No

No

Delete Team

Yes

Yes

Yes

No

No

Add Member

Yes

Yes

Yes

Yes

No

Change Members

Yes

Yes

Yes

Yes

No

Remove Member

Yes

Yes

Yes

Yes

No

13. Authorization Hierarchy

The general hierarchy is:

ADMIN
│
├── Global management
│
▼
RESOURCE OWNER
│
├── Full resource management
│
▼
MANAGER
│
├── Limited management
│
▼
LEADER
│
├── Team member management
│
▼
MEMBER
│
└── Normal access


Important:

A role in one resource does not automatically give management permissions in another resource.

For example:

Team Leader
≠
Project Manager


14. Admin Bypass

Admins can bypass normal ownership restrictions.



Example:

if (currentUser.getRole() == UserRole.ADMIN) {
return;
}


This is used for administrative management of:



Spaces

Projects

Teams

Members

15. Security Principle

The frontend must never be trusted to enforce authorization.



Bad:

Frontend:
"Hide Delete button → therefore user cannot delete."


Correct:

Frontend
│
│ request
▼
Backend
│
├── Authenticate user
├── Identify resource
├── Check role
├── Check ownership
├── Check membership
└── Allow / Reject


The backend is the final authority.

16. Typical Authorization Errors

401 Unauthorized

The user is not authenticated.



Examples:

No access token
Expired access token
Invalid token


Meaning:

"Who are you?"


403 Forbidden

The user is authenticated but does not have permission.



Example:

MEMBER tries to delete Project


Meaning:

"I know who you are,
but you are not allowed to do this."


404 Not Found

The requested resource does not exist.



Example:

GET /api/projects/{invalid-id}


400 Bad Request

The request itself is invalid.



Examples:

Already a member
Join request already pending
Request already accepted
Trying to accept a non-pending request


17. Current Authorization Architecture

                 Authentication
                       │
                       ▼
                Current User
                       │
                       ▼
                 Global Role
                 /          \
             ADMIN          USER
                              │
                              ▼
                       Resource Access
                              │
          ┌───────────────────┼───────────────────┐
          ▼                   ▼                   ▼
        Space              Project              Team
          │                   │                   │
    OWNER              OWNER/MANAGER       LEADER
    │                   │                   │
    ▼                   ▼                   ▼
    MEMBER              MEMBER              MEMBER


18. Main Rules to Remember

Rule 1

Authentication tells us who the user is.

Rule 2

Authorization tells us what the user can do.

Rule 3

Backend authorization is the source of truth.

Rule 4

ADMIN has global management permissions.

Rule 5

Ownership gives full management permissions over the owned resource, subject to the specific resource rules.

Rule 6

Manager permissions are limited compared with Owner permissions.

Rule 7

Team Leader permissions are specifically for team-member management and do not automatically grant Project or Team CRUD permissions.

Rule 8

Private Spaces require membership, ownership, or admin access.

Rule 9

Public Spaces can be discovered by non-members, but joining creates a join request.

Rule 10

Accepting a Space join request creates a SpaceMember with MEMBER role.

19. Current Status

Authentication

Register

Login

BCrypt

Email OTP

Forgot password

Reset password

Change password

JWT access token

Refresh token

Google OAuth

GitHub OAuth

Spring Security

Authorization

ADMIN permissions

Space OWNER permissions

Space MEMBER permissions

Public/private Space access

Space join requests

Accept join requests

Reject join requests

Project OWNER permissions

Project MANAGER permissions

Project MEMBER permissions

Project member invitations

Team CRUD permissions

Team LEADER permissions

Team MEMBER permissions

Private Space protection

Backend permission checks

Next Feature

Authentication ✅
Authorization  ✅
↓
Notifications 🔔
