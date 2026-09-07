package com.badr.teamprojectmanagement.task.dto;

import com.badr.teamprojectmanagement.common.enums.TaskPriority;
import com.badr.teamprojectmanagement.common.enums.TaskStatus;

import java.time.LocalDate;
import java.util.UUID;

public record TaskResponse(

        UUID id,

        String title,

        String description,

        TaskStatus status,

        TaskPriority priority,

        LocalDate dueDate,

        UUID projectId,

        UUID assignedTo
) {
}