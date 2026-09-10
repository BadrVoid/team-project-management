# User Module Documentation

## 1. Overview

The `user` module is responsible for:

* User information
* User profile
* User roles
* Email verification status
* Account banning
* User search and filtering
* User discovery
* Skills and tags
* Admin user management

The module is also used by other modules such as:

* Authentication
* Projects
* Teams
* Tasks
* Notifications
* Project invitations

---

# 2. Package Structure

```text
user/
├── User.java
├── UserController.java
├── UserRepository.java
├── UserSpecification.java
├── UserMapper.java
│
├── dtos/
│   ├── UserResponse.java
│   ├── UserUpdateRequest.java
│   └── UserDiscoveryResponse.java
│
├── profile/
│   ├── UserProfile.java
│   ├── UserProfileRepository.java
│   │
│   ├── controller/
│   │   └── UserProfileController.java
│   │
│   ├── dtos/
│   │   ├── UserProfileRequest.java
│   │   └── UserProfileResponse.java
│   │
│   └── service/
│       ├── UserProfileService.java
│       └── UserProfileServiceImpl.java
│
└── service/
    ├── UserService.java
    └── UserServiceImpl.java
```

---

# 3. User Entity

File:

```text
user/User.java
```

The `User` entity represents the main application user.

Important fields:

```text
id
firstName
lastName
email
password
role
verified
banned
profile
createdAt
updatedAt
```

### Important fields

### `id`

```java
UUID id;
```

Unique identifier for the user.

All users use UUIDs instead of numeric IDs.

---

### `firstName` / `lastName`

The user's basic name information.

---

### `email`

The user's unique login email.

```java
@Column(nullable = false, unique = true)
private String email;
```

---

### `password`

Stores the BCrypt-hashed password.

The raw password should never be stored in the database.

---

### `role`

Represents the user's application role.

Current roles:

```text
USER
ADMIN
```

The role is also used by Spring Security.

For example:

```text
ROLE_USER
ROLE_ADMIN
```

---

### `verified`

```java
private boolean verified;
```

Represents whether the user's email has been verified.

This is related to the OTP email verification flow.

Important:

> `verified` does NOT mean the account is enabled.

---

### `banned`

```java
private boolean banned;
```

Represents whether an administrator has banned the account.

Important:

> `banned` is separate from email verification.

A user can be:

```text
verified = true
banned = false
```

or:

```text
verified = true
banned = true
```

---

### `profile`

The user has a one-to-one relationship with `UserProfile`.

```text
User 1 ───── 1 UserProfile
```

---

# 4. UserProfile Entity

File:

```text
user/profile/UserProfile.java
```

The profile contains additional information that is not part of the core authentication user.

Fields:

```text
id
user
bio
university
department
avatarUrl
skills
tags
```

### Why separate User and UserProfile?

The `User` entity contains important authentication/account information.

The profile contains information used for:

* User discovery
* Project member discovery
* Skills
* Tags
* Profile display

This keeps the main `User` entity cleaner.

---

# 5. UserProfile Relationships

## User → UserProfile

```text
User
  │
  │ One-to-One
  ↓
UserProfile
```

`UserProfile` contains:

```java
@OneToOne
private User user;
```

`User` contains the inverse relationship:

```java
@OneToOne(mappedBy = "user")
private UserProfile profile;
```

---

# 6. Skills

Skills are stored using:

```java
@ElementCollection
private List<String> skills;
```

Example:

```text
Java
Spring Boot
Spring Security
React
PostgreSQL
Docker
```

They are stored in a separate table:

```text
user_profile_skills
```

Relationship:

```text
UserProfile
    │
    │ 1 → many
    ↓
UserProfileSkills
```

---

# 7. Tags

Tags work similarly to skills.

Example:

```text
Backend
Frontend
Full Stack
Java Developer
React Developer
```

They are stored using:

```java
@ElementCollection
private List<String> tags;
```

Database table:

```text
user_profile_tags
```

---

# 8. User DTOs

DTOs are used instead of exposing entities directly through the API.

Current DTOs:

```text
UserResponse
UserUpdateRequest
UserDiscoveryResponse
```

---

# 9. UserResponse

File:

```text
user/dtos/UserResponse.java
```

Purpose:

> Used when returning normal user information to the client.

Contains:

```text
id
firstName
lastName
email
role
verified
banned
```

Example response:

```json
{
  "id": "uuid",
  "firstName": "Badr",
  "lastName": "Mohamed",
  "email": "badr@example.com",
  "role": "USER",
  "verified": true,
  "banned": false
}
```

This DTO is used for things such as:

* Get user by ID
* Get user by email
* Admin user list
* Update user
* Other normal user information

---

# 10. UserUpdateRequest

File:

```text
user/dtos/UserUpdateRequest.java
```

Purpose:

> Contains the fields that can be changed when updating user information.

Currently:

```text
firstName
lastName
```

Example:

```json
{
  "firstName": "Badr",
  "lastName": "Mohamed"
}
```

It is a request DTO, so it is used for incoming data.

---

# 11. UserDiscoveryResponse

File:

```text
user/dtos/UserDiscoveryResponse.java
```

Purpose:

> Used when searching for users who may be invited to a project.

It contains useful public/discovery information:

```text
id
firstName
lastName
role
bio
avatarUrl
skills
tags
```

It intentionally does not expose sensitive information such as:

```text
password
```

This DTO is mainly used by the project member invitation flow.

Example:

```json
{
  "id": "uuid",
  "firstName": "Badr",
  "lastName": "Mohamed",
  "role": "USER",
  "bio": "Backend developer",
  "avatarUrl": "...",
  "skills": [
    "Java",
    "Spring Boot",
    "PostgreSQL"
  ],
  "tags": [
    "Backend",
    "Full Stack"
  ]
}
```

---

# 12. Profile DTOs

Profile has its own DTOs because it is a separate part of the User module.

```text
user/profile/dtos/
├── UserProfileRequest.java
└── UserProfileResponse.java
```

---

# 13. UserProfileRequest

Purpose:

> Receives profile information from the client when creating or updating a profile.

Fields:

```text
bio
university
department
avatarUrl
skills
tags
```

Example:

```json
{
  "bio": "Backend developer interested in Spring Boot",
  "university": "Capital University",
  "department": "Computer Science",
  "avatarUrl": "https://...",
  "skills": [
    "Java",
    "Spring Boot",
    "PostgreSQL"
  ],
  "tags": [
    "Backend",
    "Full Stack"
  ]
}
```

---

# 14. UserProfileResponse

Purpose:

> Returns complete profile information.

Contains:

```text
userId
firstName
lastName
email
role
bio
university
department
avatarUrl
skills
tags
```

The user information is included so the frontend does not need to make another request just to display the basic user information.

---

# 15. UserRepository

File:

```text
user/UserRepository.java
```

Extends:

```java
JpaRepository<User, UUID>
JpaSpecificationExecutor<User>
```

The important part is:

```java
JpaSpecificationExecutor<User>
```

This allows us to use dynamic Specifications.

Current custom methods:

```java
Optional<User> findByEmail(String email);

boolean existsByEmail(String email);
```

---

# 16. UserSpecification

File:

```text
user/UserSpecification.java
```

Purpose:

> Contains dynamic database filtering/search conditions.

Instead of putting query logic inside `UserServiceImpl`, we keep it inside `UserSpecification`.

Current specifications:

```text
keyword()
hasRole()
isVerified()
isBanned()
skill()
tag()
```

---

# 17. Keyword Specification

```java
UserSpecification.keyword(keyword)
```

Searches through:

```text
firstName
lastName
email
```

For example:

```text
keyword = "badr"
```

can match:

```text
Badr Mohamed
Mohamed Badr
badr@example.com
```

Conceptually:

```sql
WHERE
    first_name LIKE '%badr%'
    OR last_name LIKE '%badr%'
    OR email LIKE '%badr%'
```

---

# 18. Role Specification

```java
UserSpecification.hasRole(role)
```

Filters users by:

```text
USER
ADMIN
```

Example:

```text
?role=USER
```

Conceptually:

```sql
WHERE role = 'USER'
```

---

# 19. Verification Specification

```java
UserSpecification.isVerified(verified)
```

Filters by email verification status.

Example:

```text
?verified=true
```

Conceptually:

```sql
WHERE is_verified = true
```

---

# 20. Ban Specification

```java
UserSpecification.isBanned(banned)
```

Filters banned/unbanned users.

Example:

```text
?banned=false
```

Conceptually:

```sql
WHERE is_banned = false
```

---

# 21. Skill Specification

```java
UserSpecification.skill(skill)
```

Searches inside the user's profile skills.

Example:

```text
?skill=Spring Boot
```

The query joins:

```text
User
  ↓
UserProfile
  ↓
skills
```

Because `skills` is an `@ElementCollection`.

---

# 22. Tag Specification

```java
UserSpecification.tag(tag)
```

Searches inside the user's profile tags.

Example:

```text
?tag=Backend
```

The query joins:

```text
User
  ↓
UserProfile
  ↓
tags
```

---

# 23. Why `Join` Is Used

The `User` entity contains:

```java
private UserProfile profile;
```

So when querying profile information:

```java
Join<User, UserProfile> profile =
        root.join("profile", JoinType.LEFT);
```

This represents:

```text
User
 ↓
UserProfile
```

The types mean:

```text
Join<User, UserProfile>
     ↑       ↑
    From     To
```

For skills:

```java
ListJoin<UserProfile, String> skills =
        profile.joinList("skills", JoinType.LEFT);
```

Because `skills` is:

```java
List<String>
```

The path is:

```text
User
 ↓
UserProfile
 ↓
List<String>
 ↓
String
```

---

# 24. UserMapper

File:

```text
user/UserMapper.java
```

Purpose:

> Converts entities into DTOs.

The service should not manually create DTOs.

Instead of:

```java
return new UserResponse(...);
```

the service uses:

```java
userMapper.toResponse(user);
```

For discovery:

```java
userMapper.toDiscoveryResponse(user);
```

---

# 25. Why Use a Mapper?

Without a mapper:

```text
UserService
 ├── business logic
 ├── query logic
 └── DTO conversion
```

With a mapper:

```text
UserService
       │
       ├── business logic
       │
       ↓
UserSpecification
       │
       ↓
Repository

UserMapper
       ↓
DTO
```

This makes the service easier to maintain.

---

# 26. UserService

File:

```text
user/service/UserService.java
```

Responsible for user-related operations.

Main operations:

```text
getUsers()
discoverUsers()
getUserById()
getUserByEmail()
updateUser()
updateUserRole()
updateUserBanStatus()
deleteUser()
```

---

# 27. UserServiceImpl

File:

```text
user/service/UserServiceImpl.java
```

Implementation of `UserService`.

The service coordinates:

```text
Repository
Specification
Mapper
```

For example:

```java
Specification<User> specification =
        Specification.where(
                UserSpecification.keyword(keyword)
        )
        .and(UserSpecification.hasRole(role))
        .and(UserSpecification.isVerified(verified))
        .and(UserSpecification.isBanned(banned));
```

Then:

```java
return userRepository
        .findAll(specification, pageable)
        .map(userMapper::toResponse);
```

---

# 28. Admin User Management

Admins can manage users.

Current operations:

```text
GET    /api/users
GET    /api/users/{id}
GET    /api/users/email
PATCH  /api/users/{id}/role
PATCH  /api/users/{id}/ban
DELETE /api/users/{id}
```

These operations should be protected using:

```java
@PreAuthorize("hasRole('ADMIN')")
```

---

# 29. User Search and Filtering

The main admin endpoint supports:

```text
keyword
role
verified
banned
page
size
sortBy
direction
```

Example:

```text
GET /api/users
    ?keyword=badr
    &role=USER
    &verified=true
    &banned=false
    &page=0
    &size=10
    &sortBy=createdAt
    &direction=desc
```

This is implemented using:

```text
Spring Data JPA Specification
+
Pageable
```

---

# 30. User Discovery

User discovery is different from normal admin search.

Purpose:

> Allow project leaders to find potential project members.

Endpoint:

```text
GET /api/users/discover
```

Supported filters:

```text
keyword
skill
tag
page
size
```

Examples:

```text
GET /api/users/discover?keyword=badr
```

```text
GET /api/users/discover?skill=Spring Boot
```

```text
GET /api/users/discover?tag=Backend
```

```text
GET /api/users/discover?keyword=badr&skill=Spring Boot&tag=Backend
```

---

# 31. Profile Endpoints

Current profile endpoints:

```text
GET /api/profiles/me
PUT /api/profiles/me
GET /api/profiles/{userId}
```

### Get my profile

```text
GET /api/profiles/me
```

Gets the currently authenticated user's profile.

### Update my profile

```text
PUT /api/profiles/me
```

Creates the profile if it doesn't exist or updates the existing profile.

### Get another user's profile

```text
GET /api/profiles/{userId}
```

Used when viewing another user's profile.

---

# 32. Authentication and User

Authentication is handled by the `auth` module, but it uses the `User` entity.

Login flow:

```text
User
 ↓
Login
 ↓
AuthService
 ↓
UserRepository
 ↓
Check password
 ↓
Check verified
 ↓
Check banned
 ↓
Generate JWT
```

A banned user should not receive a new access token.

---

# 33. Security Rules

Important distinctions:

```text
verified
    ↓
Email verification

banned
    ↓
Admin moderation

role
    ↓
Authorization
```

Do not use `verified` as an account enabled/disabled flag.

If the application later needs account disabling, add a separate field:

```text
enabled
```

---

# 34. User Module Responsibilities

The User module owns:

```text
User information
User profile
Skills
Tags
User discovery
User search
User filtering
Role
Ban status
Verification status
```

The User module does NOT own:

```text
Authentication logic
JWT generation
Projects
Teams
Tasks
Notifications
Project invitations
```

Those belong to their respective modules.

---

# 35. How Other Modules Use User

Other modules reference users using:

```java
UUID userId
```

Examples:

```text
Project
    createdBy → User

ProjectMember
    user → User

TeamMember
    user → User

Task
    assignedTo → User
    createdBy → User

TaskComment
    user → User

Notification
    user → User
```

The User module therefore acts as one of the central modules in the application.

---

# 36. Overall Architecture

The current User module follows:

```text
                    ┌───────────────┐
                    │   Controller  │
                    └───────┬───────┘
                            │
                            ↓
                    ┌───────────────┐
                    │    Service    │
                    └───┬───────┬───┘
                        │       │
                        ↓       ↓
              ┌────────────┐  ┌──────────────┐
              │Specification│  │    Mapper    │
              └──────┬─────┘  └──────┬───────┘
                     │               │
                     ↓               │
              ┌─────────────┐        │
              │  Repository │        │
              └──────┬──────┘        │
                     │               │
                     ↓               ↓
                  Database         DTO
```

The main idea is:

```text
Controller
    ↓
Service
    ↓
Specification → filtering/query building
    ↓
Repository → database
    ↓
Mapper → Entity to DTO
    ↓
Response
```

---

# 37. Important Design Rules

When extending the User module:

### Rule 1 — Don't return entities from controllers

Use:

```text
UserResponse
UserDiscoveryResponse
UserProfileResponse
```

instead of returning `User` directly.

### Rule 2 — Don't put query logic in the service

Use:

```text
UserSpecification
```

for dynamic filtering.

### Rule 3 — Don't manually map entities inside services

Use:

```text
UserMapper
```

### Rule 4 — Don't expose passwords

Passwords should never appear in response DTOs.

### Rule 5 — Keep profile separate

Don't keep adding profile fields directly to `User` unless there is a strong reason.

### Rule 6 — Keep verification and banning separate

```text
verified ≠ banned
```

### Rule 7 — Use UUIDs

All User-related IDs should remain UUIDs.

---

# 38. Future Improvements

Possible improvements later, only when actually needed:

```text
Account enabled/disabled
Profile image upload
Social links
Phone number
Location
More advanced user discovery
Skill categories
User availability
Profile completion percentage
User statistics
```

These should not be added until the frontend/business requirements actually need them.

---

# 39. Current Status

The User module is considered **complete for the current project scope**.

@AuthenticationPrincipal doesn't create the user.

It tells Spring Security:

“Put the currently authenticated principal/user into this parameter.”

Completed:

* [x] User entity
* [x] User repository
* [x] User service
* [x] User controller
* [x] User CRUD
* [x] Admin role management
* [x] Ban/unban
* [x] User verification status
* [x] Pagination
* [x] Sorting
* [x] Dynamic filtering
* [x] Specifications
* [x] User mapper
* [x] User discovery
* [x] Profile entity
* [x] Profile repository
* [x] Profile service
* [x] Profile controller
* [x] Profile DTOs
* [x] Skills
* [x] Tags
* [x] Search by name/email
* [x] Search by skill
* [x] Search by tag

