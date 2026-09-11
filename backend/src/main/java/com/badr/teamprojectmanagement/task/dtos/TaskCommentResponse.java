package com.badr.teamprojectmanagement.task.dtos;

import com.badr.teamprojectmanagement.user.dtos.UserSummaryResponse;

import java.time.LocalDateTime;
import java.util.UUID;

public record TaskCommentResponse(
        UUID id,
        UUID taskId,
        UserSummaryResponse user,
        String content,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {}