package com.badr.teamprojectmanagement.team.dtos;

import jakarta.validation.constraints.NotNull;

import java.util.UUID;

public record TeamMemberRequest(

        @NotNull(message = "User ID is required")
        UUID userId,

        @NotNull(message = "Team ID is required")
        UUID teamId
) {
}