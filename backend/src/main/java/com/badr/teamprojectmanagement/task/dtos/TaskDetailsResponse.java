package com.badr.teamprojectmanagement.task.dtos;

import com.badr.teamprojectmanagement.common.enums.TaskPriority;
import com.badr.teamprojectmanagement.common.enums.TaskStatus;
import com.badr.teamprojectmanagement.user.dtos.UserSummaryResponse;

import java.time.LocalDate;
import java.util.UUID;

public record TaskDetailsResponse(
        UUID id,
        UUID teamId,
        String title,
        String description,
        TaskStatus status,
        TaskPriority priority,
        LocalDate dueDate,
        UserSummaryResponse assignedTo,
        UserSummaryResponse createdBy
) {}