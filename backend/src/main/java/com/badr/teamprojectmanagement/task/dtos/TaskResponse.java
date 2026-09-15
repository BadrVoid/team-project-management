package com.badr.teamprojectmanagement.task.dtos;

import com.badr.teamprojectmanagement.common.enums.TaskPriority;
import com.badr.teamprojectmanagement.common.enums.TaskStatus;

import java.time.LocalDate;
import java.util.UUID;

public record TaskResponse(
        UUID id,
        UUID teamId,
        String title,
        String description,
        TaskStatus status,
        TaskPriority priority,
        LocalDate dueDate,
        UUID assignedTo,
        UUID createdBy
) {}