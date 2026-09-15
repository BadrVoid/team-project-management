package com.badr.teamprojectmanagement.team.dtos;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.util.UUID;

public record TeamCreateRequest(

        @NotNull(message = "Project ID is required")
        UUID projectId,

        @NotBlank(message = "Team name is required")
        @Size(max = 100, message = "Team name must not exceed 100 characters")
        String name,

        @Size(max = 500, message = "Description must not exceed 500 characters")
        String description
) {}