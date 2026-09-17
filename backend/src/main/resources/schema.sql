-- =========================================================
-- TEAM PROJECT MANAGEMENT DATABASE SCHEMA
-- PostgreSQL
-- =========================================================


-- =========================================================
-- RESET DATABASE SCHEMA
-- =========================================================

DROP SCHEMA IF EXISTS public CASCADE;

CREATE SCHEMA public;


-- =========================================================
-- USERS
-- =========================================================

CREATE TABLE users
(
    id          UUID PRIMARY KEY,
    first_name  VARCHAR(50)  NOT NULL,
    last_name   VARCHAR(50)  NOT NULL,
    email       VARCHAR(255) NOT NULL UNIQUE,
    password    VARCHAR(255) NOT NULL,
    role        VARCHAR(20)  NOT NULL DEFAULT 'USER',
    is_verified BOOLEAN      NOT NULL DEFAULT FALSE,
    is_banned   BOOLEAN      NOT NULL DEFAULT FALSE,
    created_at  TIMESTAMP    NOT NULL,
    updated_at  TIMESTAMP    NOT NULL,

    CONSTRAINT chk_users_role
        CHECK (role IN ('USER', 'ADMIN'))
);


-- =========================================================
-- USER PROFILES
-- =========================================================

CREATE TABLE user_profiles
(
    id         UUID PRIMARY KEY,
    user_id    UUID NOT NULL UNIQUE,
    bio        VARCHAR(500),
    university VARCHAR(255),
    department VARCHAR(255),
    avatar_url VARCHAR(500),

    CONSTRAINT fk_user_profiles_user
        FOREIGN KEY (user_id)
            REFERENCES users (id)
            ON DELETE CASCADE
);


-- =========================================================
-- USER PROFILE SKILLS
-- =========================================================

CREATE TABLE user_profile_skills
(
    profile_id UUID         NOT NULL,
    skill      VARCHAR(255) NOT NULL,

    CONSTRAINT fk_user_profile_skills_profile
        FOREIGN KEY (profile_id)
            REFERENCES user_profiles (id)
            ON DELETE CASCADE
);


-- =========================================================
-- USER PROFILE TAGS
-- =========================================================

CREATE TABLE user_profile_tags
(
    profile_id UUID         NOT NULL,
    tag        VARCHAR(255) NOT NULL,

    CONSTRAINT fk_user_profile_tags_profile
        FOREIGN KEY (profile_id)
            REFERENCES user_profiles (id)
            ON DELETE CASCADE
);


-- =========================================================
-- SPACES
-- =========================================================

CREATE TABLE spaces
(
    id          UUID PRIMARY KEY,
    name        VARCHAR(100) NOT NULL,
    description TEXT,
    visibility  VARCHAR(20)  NOT NULL DEFAULT 'PRIVATE',
    owner_id    UUID         NOT NULL,
    created_at  TIMESTAMP    NOT NULL,
    updated_at  TIMESTAMP    NOT NULL,

    CONSTRAINT fk_spaces_owner
        FOREIGN KEY (owner_id)
            REFERENCES users (id),

    CONSTRAINT chk_spaces_visibility
        CHECK (visibility IN ('PRIVATE', 'PUBLIC')),

    CONSTRAINT uq_spaces_owner_name
        UNIQUE (owner_id, name)
);


-- =========================================================
-- SPACE MEMBERS
-- =========================================================

CREATE TABLE space_members
(
    id         UUID PRIMARY KEY,
    created_at TIMESTAMP   NOT NULL,
    updated_at TIMESTAMP   NOT NULL,

    space_id   UUID        NOT NULL,
    user_id    UUID        NOT NULL,
    role       VARCHAR(20) NOT NULL DEFAULT 'MEMBER',

    CONSTRAINT fk_space_members_space
        FOREIGN KEY (space_id)
            REFERENCES spaces (id)
            ON DELETE CASCADE,

    CONSTRAINT fk_space_members_user
        FOREIGN KEY (user_id)
            REFERENCES users (id)
            ON DELETE CASCADE,

    CONSTRAINT uq_space_member
        UNIQUE (space_id, user_id),

    CONSTRAINT chk_space_member_role
        CHECK (role IN ('OWNER', 'MEMBER'))
);


-- =========================================================
-- SPACE JOIN REQUESTS
-- =========================================================

CREATE TABLE space_join_requests
(
    id         UUID PRIMARY KEY,
    created_at TIMESTAMP   NOT NULL,
    updated_at TIMESTAMP   NOT NULL,

    space_id   UUID        NOT NULL,
    user_id    UUID        NOT NULL,
    status     VARCHAR(20) NOT NULL DEFAULT 'PENDING',

    CONSTRAINT fk_space_join_request_space
        FOREIGN KEY (space_id)
            REFERENCES spaces (id)
            ON DELETE CASCADE,

    CONSTRAINT fk_space_join_request_user
        FOREIGN KEY (user_id)
            REFERENCES users (id)
            ON DELETE CASCADE,

    CONSTRAINT uq_space_join_request
        UNIQUE (space_id, user_id),

    CONSTRAINT chk_space_join_request_status
        CHECK (
            status IN (
                       'PENDING',
                       'ACCEPTED',
                       'REJECTED'
                )
            )
);


-- =========================================================
-- PROJECTS
-- =========================================================

CREATE TABLE projects
(
    id          UUID PRIMARY KEY,
    space_id    UUID         NOT NULL,
    name        VARCHAR(100) NOT NULL,
    description TEXT,
    status      VARCHAR(20)  NOT NULL DEFAULT 'PLANNING',
    visibility  VARCHAR(20)  NOT NULL DEFAULT 'PRIVATE',
    start_date  DATE,
    end_date    DATE,
    created_by  UUID         NOT NULL,
    created_at  TIMESTAMP    NOT NULL,
    updated_at  TIMESTAMP    NOT NULL,

    CONSTRAINT fk_projects_space
        FOREIGN KEY (space_id)
            REFERENCES spaces (id)
            ON DELETE CASCADE,

    CONSTRAINT fk_projects_created_by
        FOREIGN KEY (created_by)
            REFERENCES users (id),

    CONSTRAINT uq_projects_space_name
        UNIQUE (space_id, name),

    CONSTRAINT chk_projects_status
        CHECK (
            status IN (
                       'PLANNING',
                       'ACTIVE',
                       'COMPLETED',
                       'ARCHIVED'
                )
            ),

    CONSTRAINT chk_projects_visibility
        CHECK (visibility IN ('PRIVATE', 'PUBLIC'))
);


-- =========================================================
-- PROJECT MEMBERS
-- =========================================================

CREATE TABLE project_members
(
    id         UUID PRIMARY KEY,
    project_id UUID        NOT NULL,
    user_id    UUID        NOT NULL,
    role       VARCHAR(20) NOT NULL DEFAULT 'MEMBER',
    status     VARCHAR(20) NOT NULL DEFAULT 'ACCEPTED',
    created_at TIMESTAMP   NOT NULL,
    updated_at TIMESTAMP   NOT NULL,

    CONSTRAINT fk_project_members_project
        FOREIGN KEY (project_id)
            REFERENCES projects (id)
            ON DELETE CASCADE,

    CONSTRAINT fk_project_members_user
        FOREIGN KEY (user_id)
            REFERENCES users (id)
            ON DELETE CASCADE,

    CONSTRAINT uq_project_members
        UNIQUE (project_id, user_id),

    CONSTRAINT chk_project_members_role
        CHECK (
            role IN (
                     'OWNER',
                     'MANAGER',
                     'MEMBER'
                )
            ),

    CONSTRAINT chk_project_members_status
        CHECK (
            status IN (
                       'PENDING',
                       'ACCEPTED',
                       'REJECTED'
                )
            )
);


-- =========================================================
-- PROJECT JOIN REQUESTS / INVITATIONS
-- =========================================================

CREATE TABLE project_join_requests
(
    id         UUID PRIMARY KEY,
    project_id UUID        NOT NULL,
    user_id    UUID        NOT NULL,
    status     VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    created_at TIMESTAMP   NOT NULL,
    updated_at TIMESTAMP   NOT NULL,

    CONSTRAINT fk_project_join_requests_project
        FOREIGN KEY (project_id)
            REFERENCES projects (id)
            ON DELETE CASCADE,

    CONSTRAINT fk_project_join_requests_user
        FOREIGN KEY (user_id)
            REFERENCES users (id)
            ON DELETE CASCADE,

    CONSTRAINT uq_project_join_request
        UNIQUE (project_id, user_id),

    CONSTRAINT chk_project_join_requests_status
        CHECK (
            status IN (
                       'PENDING',
                       'ACCEPTED',
                       'REJECTED'
                )
            )
);


-- =========================================================
-- TEAMS
-- =========================================================

CREATE TABLE teams
(
    id          UUID PRIMARY KEY,
    project_id  UUID         NOT NULL,
    name        VARCHAR(100) NOT NULL,
    description TEXT,
    visibility  VARCHAR(20)  NOT NULL DEFAULT 'PRIVATE',
    created_at  TIMESTAMP    NOT NULL,
    updated_at  TIMESTAMP    NOT NULL,

    CONSTRAINT fk_teams_project
        FOREIGN KEY (project_id)
            REFERENCES projects (id)
            ON DELETE CASCADE,

    CONSTRAINT uq_teams_project_name
        UNIQUE (project_id, name),

    CONSTRAINT chk_teams_visibility
        CHECK (visibility IN ('PRIVATE', 'PUBLIC'))
);


-- =========================================================
-- TEAM MEMBERS
-- =========================================================

CREATE TABLE team_members
(
    id         UUID PRIMARY KEY,
    team_id    UUID        NOT NULL,
    user_id    UUID        NOT NULL,
    role       VARCHAR(20) NOT NULL DEFAULT 'MEMBER',
    created_at TIMESTAMP   NOT NULL,
    updated_at TIMESTAMP   NOT NULL,

    CONSTRAINT fk_team_members_team
        FOREIGN KEY (team_id)
            REFERENCES teams (id)
            ON DELETE CASCADE,

    CONSTRAINT fk_team_members_user
        FOREIGN KEY (user_id)
            REFERENCES users (id)
            ON DELETE CASCADE,

    CONSTRAINT uq_team_members
        UNIQUE (team_id, user_id),

    CONSTRAINT chk_team_members_role
        CHECK (
            role IN (
                     'LEADER',
                     'MEMBER'
                )
            )
);


-- =========================================================
-- TEAM JOIN REQUESTS / INVITATIONS
-- =========================================================

CREATE TABLE team_join_requests
(
    id         UUID PRIMARY KEY,
    team_id    UUID        NOT NULL,
    user_id    UUID        NOT NULL,
    status     VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    created_at TIMESTAMP   NOT NULL,
    updated_at TIMESTAMP   NOT NULL,

    CONSTRAINT fk_team_join_requests_team
        FOREIGN KEY (team_id)
            REFERENCES teams (id)
            ON DELETE CASCADE,

    CONSTRAINT fk_team_join_requests_user
        FOREIGN KEY (user_id)
            REFERENCES users (id)
            ON DELETE CASCADE,

    CONSTRAINT uq_team_join_request
        UNIQUE (team_id, user_id),

    CONSTRAINT chk_team_join_requests_status
        CHECK (
            status IN (
                       'PENDING',
                       'ACCEPTED',
                       'REJECTED'
                )
            )
);


-- =========================================================
-- TASKS
-- =========================================================

CREATE TABLE tasks
(
    id          UUID PRIMARY KEY,
    team_id     UUID         NOT NULL,
    assigned_to UUID,
    created_by  UUID         NOT NULL,
    title       VARCHAR(150) NOT NULL,
    description TEXT,
    status      VARCHAR(20)  NOT NULL DEFAULT 'TODO',
    priority    VARCHAR(20)  NOT NULL DEFAULT 'MEDIUM',
    due_date    DATE,
    created_at  TIMESTAMP    NOT NULL,
    updated_at  TIMESTAMP    NOT NULL,

    CONSTRAINT fk_tasks_team
        FOREIGN KEY (team_id)
            REFERENCES teams (id)
            ON DELETE CASCADE,

    CONSTRAINT fk_tasks_assigned_to
        FOREIGN KEY (assigned_to)
            REFERENCES users (id)
            ON DELETE SET NULL,

    CONSTRAINT fk_tasks_created_by
        FOREIGN KEY (created_by)
            REFERENCES users (id),

    CONSTRAINT chk_tasks_status
        CHECK (
            status IN (
                       'TODO',
                       'IN_PROGRESS',
                       'IN_REVIEW',
                       'COMPLETED'
                )
            ),

    CONSTRAINT chk_tasks_priority
        CHECK (
            priority IN (
                         'LOW',
                         'MEDIUM',
                         'HIGH',
                         'URGENT'
                )
            )
);


-- =========================================================
-- TASK COMMENTS
-- =========================================================

CREATE TABLE task_comments
(
    id         UUID PRIMARY KEY,
    task_id    UUID      NOT NULL,
    user_id    UUID      NOT NULL,
    content    TEXT      NOT NULL,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,

    CONSTRAINT fk_task_comments_task
        FOREIGN KEY (task_id)
            REFERENCES tasks (id)
            ON DELETE CASCADE,

    CONSTRAINT fk_task_comments_user
        FOREIGN KEY (user_id)
            REFERENCES users (id)
            ON DELETE CASCADE
);


-- =========================================================
-- NOTIFICATIONS
-- =========================================================

CREATE TABLE notifications
(
    id         UUID PRIMARY KEY,
    user_id    UUID         NOT NULL,
    title      VARCHAR(150) NOT NULL,
    message    TEXT         NOT NULL,
    type       VARCHAR(30)  NOT NULL,
    is_read    BOOLEAN      NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP    NOT NULL,
    updated_at TIMESTAMP    NOT NULL,

    CONSTRAINT fk_notifications_user
        FOREIGN KEY (user_id)
            REFERENCES users (id)
            ON DELETE CASCADE,

    CONSTRAINT chk_notifications_type
        CHECK (
            type IN (
                     'TASK_ASSIGNED',
                     'TASK_UPDATED',
                     'TASK_COMMENTED',
                     'PROJECT_INVITATION',
                     'TEAM_INVITATION',
                     'SYSTEM'
                )
            )
);


-- =========================================================
-- REFRESH TOKENS
-- =========================================================

CREATE TABLE refresh_tokens
(
    id         UUID PRIMARY KEY,
    user_id    UUID         NOT NULL,
    token      VARCHAR(500) NOT NULL UNIQUE,
    expires_at TIMESTAMP    NOT NULL,
    created_at TIMESTAMP    NOT NULL,

    CONSTRAINT fk_refresh_tokens_user
        FOREIGN KEY (user_id)
            REFERENCES users (id)
            ON DELETE CASCADE
);


-- =========================================================
-- OTPS
-- =========================================================

CREATE TABLE otps
(
    id         UUID PRIMARY KEY,
    user_id    UUID         NOT NULL,
    otp_hash   VARCHAR(255) NOT NULL,
    type       VARCHAR(30)  NOT NULL,
    expires_at TIMESTAMP    NOT NULL,
    used       BOOLEAN      NOT NULL DEFAULT FALSE,
    attempts   INT          NOT NULL DEFAULT 0,
    created_at TIMESTAMP    NOT NULL,
    updated_at TIMESTAMP    NOT NULL,

    CONSTRAINT fk_otps_user
        FOREIGN KEY (user_id)
            REFERENCES users (id)
            ON DELETE CASCADE,

    CONSTRAINT chk_otps_type
        CHECK (
            type IN (
                     'EMAIL_VERIFICATION',
                     'PASSWORD_RESET'
                )
            )
);


-- =========================================================
-- USER AUTHENTICATIONS
-- =========================================================

CREATE TABLE user_authentications
(
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id     UUID         NOT NULL,
    provider    VARCHAR(20)  NOT NULL,
    provider_id VARCHAR(255) NOT NULL,

    CONSTRAINT fk_user_authentication_user
        FOREIGN KEY (user_id)
            REFERENCES users (id)
            ON DELETE CASCADE,

    CONSTRAINT uk_provider_provider_id
        UNIQUE (provider, provider_id)
);


-- =========================================================
-- INDEXES
-- =========================================================

-- Users

CREATE INDEX idx_users_first_name
    ON users (first_name);

CREATE INDEX idx_users_last_name
    ON users (last_name);

CREATE INDEX idx_users_email
    ON users (email);

CREATE INDEX idx_users_role
    ON users (role);

CREATE INDEX idx_users_verified
    ON users (is_verified);

CREATE INDEX idx_users_banned
    ON users (is_banned);


-- User Profiles

CREATE INDEX idx_user_profiles_user_id
    ON user_profiles (user_id);


-- User Profile Skills

CREATE INDEX idx_user_profile_skills_profile_id
    ON user_profile_skills (profile_id);

CREATE INDEX idx_user_profile_skills_skill
    ON user_profile_skills (skill);


-- User Profile Tags

CREATE INDEX idx_user_profile_tags_profile_id
    ON user_profile_tags (profile_id);

CREATE INDEX idx_user_profile_tags_tag
    ON user_profile_tags (tag);


-- Spaces

CREATE INDEX idx_spaces_owner_id
    ON spaces (owner_id);

CREATE INDEX idx_spaces_visibility
    ON spaces (visibility);


-- Space Members

CREATE INDEX idx_space_members_space_id
    ON space_members (space_id);

CREATE INDEX idx_space_members_user_id
    ON space_members (user_id);

CREATE INDEX idx_space_members_role
    ON space_members (role);


-- Space Join Requests

CREATE INDEX idx_space_join_requests_space_id
    ON space_join_requests (space_id);

CREATE INDEX idx_space_join_requests_user_id
    ON space_join_requests (user_id);

CREATE INDEX idx_space_join_requests_status
    ON space_join_requests (status);


-- Projects

CREATE INDEX idx_projects_space_id
    ON projects (space_id);

CREATE INDEX idx_projects_created_by
    ON projects (created_by);

CREATE INDEX idx_projects_visibility
    ON projects (visibility);

CREATE INDEX idx_projects_status
    ON projects (status);


-- Project Members

CREATE INDEX idx_project_members_project_id
    ON project_members (project_id);

CREATE INDEX idx_project_members_user_id
    ON project_members (user_id);

CREATE INDEX idx_project_members_status
    ON project_members (status);


-- Project Join Requests

CREATE INDEX idx_project_join_requests_project_id
    ON project_join_requests (project_id);

CREATE INDEX idx_project_join_requests_user_id
    ON project_join_requests (user_id);

CREATE INDEX idx_project_join_requests_status
    ON project_join_requests (status);


-- Teams

CREATE INDEX idx_teams_project_id
    ON teams (project_id);

CREATE INDEX idx_teams_visibility
    ON teams (visibility);


-- Team Members

CREATE INDEX idx_team_members_team_id
    ON team_members (team_id);

CREATE INDEX idx_team_members_user_id
    ON team_members (user_id);

CREATE INDEX idx_team_members_role
    ON team_members (role);


-- Team Join Requests

CREATE INDEX idx_team_join_requests_team_id
    ON team_join_requests (team_id);

CREATE INDEX idx_team_join_requests_user_id
    ON team_join_requests (user_id);

CREATE INDEX idx_team_join_requests_status
    ON team_join_requests (status);


-- Tasks

CREATE INDEX idx_tasks_team_id
    ON tasks (team_id);

CREATE INDEX idx_tasks_assigned_to
    ON tasks (assigned_to);

CREATE INDEX idx_tasks_created_by
    ON tasks (created_by);

CREATE INDEX idx_tasks_status
    ON tasks (status);

CREATE INDEX idx_tasks_due_date
    ON tasks (due_date);


-- Task Comments

CREATE INDEX idx_task_comments_task_id
    ON task_comments (task_id);

CREATE INDEX idx_task_comments_user_id
    ON task_comments (user_id);


-- Notifications

CREATE INDEX idx_notifications_user_id
    ON notifications (user_id);

CREATE INDEX idx_notifications_is_read
    ON notifications (is_read);


-- Refresh Tokens

CREATE INDEX idx_refresh_tokens_user_id
    ON refresh_tokens (user_id);


-- OTPs

CREATE INDEX idx_otps_user_type
    ON otps (user_id, type);

CREATE INDEX idx_otps_expires_at
    ON otps (expires_at);


-- User Authentications

CREATE INDEX idx_user_authentications_user_id
    ON user_authentications (user_id);