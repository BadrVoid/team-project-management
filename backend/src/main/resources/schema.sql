-- Team Project Management Database Schema -- PostgreSQL --

-- Users
CREATE TABLE users
(
    id          UUID PRIMARY KEY,
    first_name  VARCHAR(50)  NOT NULL,
    last_name   VARCHAR(50)  NOT NULL,
    email       VARCHAR(255) NOT NULL UNIQUE,
    password    VARCHAR(255) NOT NULL,
    role        VARCHAR(20)  NOT NULL DEFAULT 'USER',
    is_verified BOOLEAN      NOT NULL DEFAULT FALSE,
    created_at  TIMESTAMP    NOT NULL,
    updated_at  TIMESTAMP    NOT NULL,

    CONSTRAINT chk_users_role
        CHECK (role IN ('USER', 'ADMIN'))
);

-- Spaces
CREATE TABLE spaces
(
    id          UUID PRIMARY KEY,
    name        VARCHAR(100) NOT NULL,
    description TEXT,
    owner_id    UUID         NOT NULL,
    created_at  TIMESTAMP    NOT NULL,
    updated_at  TIMESTAMP    NOT NULL,

    CONSTRAINT fk_spaces_owner
        FOREIGN KEY (owner_id)
            REFERENCES users (id)
);

-- Projects
CREATE TABLE projects
(
    id          UUID PRIMARY KEY,
    space_id    UUID         NOT NULL,
    name        VARCHAR(100) NOT NULL,
    description TEXT,
    status      VARCHAR(20)  NOT NULL DEFAULT 'PLANNING',
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

    CONSTRAINT chk_projects_status
        CHECK (status IN (
                          'PLANNING',
                          'ACTIVE',
                          'COMPLETED',
                          'ARCHIVED'
            ))
);

-- Project Members
CREATE TABLE project_members
(
    id         UUID PRIMARY KEY,
    project_id UUID        NOT NULL,
    user_id    UUID        NOT NULL,
    role       VARCHAR(20) NOT NULL DEFAULT 'MEMBER',
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
        CHECK (role IN (
                        'OWNER',
                        'MANAGER',
                        'MEMBER'
            ))
);

-- Teams
CREATE TABLE teams
(
    id          UUID PRIMARY KEY,
    project_id  UUID         NOT NULL,
    name        VARCHAR(100) NOT NULL,
    description TEXT,
    created_at  TIMESTAMP    NOT NULL,
    updated_at  TIMESTAMP    NOT NULL,

    CONSTRAINT fk_teams_project
        FOREIGN KEY (project_id)
            REFERENCES projects (id)
            ON DELETE CASCADE,

    CONSTRAINT uq_teams_project_name
        UNIQUE (project_id, name)
);

-- Team Members
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
        CHECK (role IN (
                        'LEADER',
                        'MEMBER'
            ))
);

-- Tasks
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
    due_date    TIMESTAMP,
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
        CHECK (status IN (
                          'TODO',
                          'IN_PROGRESS',
                          'IN_REVIEW',
                          'COMPLETED'
            )),

    CONSTRAINT chk_tasks_priority
        CHECK (priority IN (
                            'LOW',
                            'MEDIUM',
                            'HIGH',
                            'URGENT'
            ))
);

-- Task Comments
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

-- Notifications
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
        CHECK (type IN (
                        'TASK_ASSIGNED',
                        'TASK_UPDATED',
                        'TASK_COMMENTED',
                        'PROJECT_INVITATION',
                        'TEAM_INVITATION',
                        'SYSTEM'
            ))
);

-- Refresh Tokens
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

-- OTPs
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
        CHECK (type IN (
                        'EMAIL_VERIFICATION',
                        'PASSWORD_RESET'
            ))
);

-- Indexes
CREATE INDEX idx_spaces_owner_id
    ON spaces (owner_id);

CREATE INDEX idx_projects_space_id
    ON projects (space_id);

CREATE INDEX idx_projects_created_by
    ON projects (created_by);

CREATE INDEX idx_project_members_project_id
    ON project_members (project_id);

CREATE INDEX idx_project_members_user_id
    ON project_members (user_id);

CREATE INDEX idx_teams_project_id
    ON teams (project_id);

CREATE INDEX idx_team_members_team_id
    ON team_members (team_id);

CREATE INDEX idx_team_members_user_id
    ON team_members (user_id);

CREATE INDEX idx_tasks_team_id
    ON tasks (team_id);

CREATE INDEX idx_tasks_assigned_to
    ON tasks (assigned_to);

CREATE INDEX idx_tasks_created_by
    ON tasks (created_by);

CREATE INDEX idx_task_comments_task_id
    ON task_comments (task_id);

CREATE INDEX idx_task_comments_user_id
    ON task_comments (user_id);

CREATE INDEX idx_notifications_user_id
    ON notifications (user_id);

CREATE INDEX idx_refresh_tokens_user_id
    ON refresh_tokens (user_id);

CREATE INDEX idx_otps_user_type
    ON otps (user_id, type);

CREATE INDEX idx_otps_expires_at
    ON otps (expires_at);

--RESET THE SCHEMA
drop SCHEMA public cascade
CREATE SCHEMA public;