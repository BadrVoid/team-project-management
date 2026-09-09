package com.badr.teamprojectmanagement.team.dtos;

import com.badr.teamprojectmanagement.common.enums.TeamMemberRole;
import jakarta.validation.constraints.NotNull;

import java.util.UUID;

public record TeamMemberRequest(

        @NotNull(message = "User ID is required")
        UUID userId,

        @NotNull(message = "Role is required")
        TeamMemberRole role
) {}