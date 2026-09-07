package com.badr.teamprojectmanagement.task.dtos;

import com.badr.teamprojectmanagement.common.enums.TaskPriority;
import com.badr.teamprojectmanagement.common.enums.TaskStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;
import java.util.UUID;

public record TaskCreateRequest(

        @NotBlank(message = "Task title is required")
        @Size(max = 150, message = "Task title must not exceed 150 characters")
        String title,

        @Size(max = 1000, message = "Description must not exceed 1000 characters")
        String description,

        TaskStatus status,

        TaskPriority priority,

        LocalDate dueDate,

        UUID projectId,

        UUID assignedTo
) {
}