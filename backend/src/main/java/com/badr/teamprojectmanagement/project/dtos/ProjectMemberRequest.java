package com.badr.teamprojectmanagement.project.dtos;

import com.badr.teamprojectmanagement.common.enums.ProjectMemberRole;
import jakarta.validation.constraints.NotNull;

import java.util.UUID;

public record ProjectMemberRequest(

        @NotNull(message = "User ID is required")
        UUID userId,

        @NotNull(message = "Role is required")
        ProjectMemberRole role
) {
}