package com.badr.teamprojectmanagement.project.dtos;

import jakarta.validation.constraints.NotNull;

import java.util.UUID;

public record ProjectMemberRequest(

        @NotNull(message = "User ID is required")
        UUID userId,

        @NotNull(message = "Project ID is required")
        UUID projectId
) {
}