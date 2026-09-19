package com.badr.teamprojectmanagement.project.dtos;

import com.badr.teamprojectmanagement.common.enums.ProjectStatus;
import com.badr.teamprojectmanagement.common.enums.Visibility;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;
import java.util.UUID;

public record ProjectCreateRequest(

        @NotNull(message = "Space ID is required")
        UUID spaceId,

        @NotBlank(message = "Project name is required")
        @Size(max = 100, message = "Project name must not exceed 100 characters")
        String name,

        @Size(max = 500, message = "Description must not exceed 500 characters")
        String description,

        ProjectStatus status,

        Visibility visibility,

        LocalDate startDate,

        LocalDate endDate
) {
}
