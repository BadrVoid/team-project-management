````md
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

```
```
