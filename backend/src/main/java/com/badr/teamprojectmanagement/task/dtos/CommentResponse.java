package com.badr.teamprojectmanagement.comment.dtos;

import java.time.LocalDateTime;
import java.util.UUID;

public record CommentResponse(

        UUID id,

        String content,

        UUID taskId,

        UUID userId,

        LocalDateTime createdAt,

        LocalDateTime updatedAt
) {
}