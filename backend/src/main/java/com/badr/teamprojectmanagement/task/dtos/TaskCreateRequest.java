package com.badr.teamprojectmanagement.task.dtos;

import com.badr.teamprojectmanagement.common.enums.TaskPriority;
import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;
import java.util.UUID;

public record TaskCreateRequest(

        @NotNull(message = "Team ID is required")
        UUID teamId,

        @NotBlank(message = "Title is required")
        @Size(max = 150, message = "Title must not exceed 150 characters")
        String title,

        @Size(max = 5000, message = "Description must not exceed 5000 characters")
        String description,

        TaskPriority priority,

        @FutureOrPresent(message = "Due date cannot be in the past")
        LocalDate dueDate,

        UUID assignedToId
) {}