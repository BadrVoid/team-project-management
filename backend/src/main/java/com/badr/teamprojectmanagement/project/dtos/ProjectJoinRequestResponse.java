package com.badr.teamprojectmanagement.project.dtos;

import com.badr.teamprojectmanagement.common.enums.JoinRequestStatus;

import java.util.UUID;

public record ProjectJoinRequestResponse(
        UUID id,
        UUID projectId,
        UUID userId,
        JoinRequestStatus status
) {
    public static ProjectJoinRequestResponseBuilder builder() {
        return new ProjectJoinRequestResponseBuilder();
    }

    public static class ProjectJoinRequestResponseBuilder {
        private UUID id;
        private UUID projectId;
        private UUID userId;
        private JoinRequestStatus status;

        ProjectJoinRequestResponseBuilder() {
        }

        public ProjectJoinRequestResponseBuilder id(UUID id) {
            this.id = id;
            return this;
        }

        public ProjectJoinRequestResponseBuilder projectId(UUID projectId) {
            this.projectId = projectId;
            return this;
        }

        public ProjectJoinRequestResponseBuilder userId(UUID userId) {
            this.userId = userId;
            return this;
        }

        public ProjectJoinRequestResponseBuilder status(JoinRequestStatus status) {
            this.status = status;
            return this;
        }

        public ProjectJoinRequestResponse build() {
            return new ProjectJoinRequestResponse(id, projectId, userId, status);
        }
    }
}