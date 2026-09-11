````md
# Space Module

## Overview

A Space is a higher-level container used to organize projects.

The current architecture allows a user to own a space and create projects inside it.

---

## Package

```text
com.badr.teamprojectmanagement.space
````

---

## Entity

### Space

The `Space` entity represents a workspace/container for projects.

Important relationship:

```text
User 1 ─── * Space
```

The owner is stored using:

```text
spaces.owner_id
```

---

## Relationship With Projects

```text
Space 1 ─── * Project
```

Each project belongs to a space.

Database relationship:

```text
projects.space_id → spaces.id
```

---

## Ownership

Every space has an owner.

The owner is a `User`.

```text
Space
 └── owner → User
```

The owner relationship is important for authorization and future space-level management.

---

## Responsibilities

The Space module is responsible for:

* Creating spaces.
* Updating spaces.
* Retrieving spaces.
* Deleting spaces when allowed.
* Managing the relationship between spaces and their projects.
* Enforcing space ownership rules.

---

## Architecture

```text
space/
├── Space.java
├── SpaceRepository.java
├── controller/
├── dtos/
└── service/
```

---

## Design Rules

* Every space has an owner.
* A space can contain multiple projects.
* Projects reference their parent space.
* Authorization should be based on the authenticated user.
* Use DTOs instead of exposing JPA entities directly.

```
```
