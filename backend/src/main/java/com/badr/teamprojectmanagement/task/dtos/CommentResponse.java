package com.badr.teamprojectmanagement.task.dtos;

import java.time.LocalDateTime;
import java.util.UUID;

public record CommentResponse(
        UUID id,
        UUID taskId,
        UUID userId,
        String firstName,
        String lastName,
        String content,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {}