package com.badr.teamprojectmanagement.comment.dtos;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CommentUpdateRequest(

        @NotBlank(message = "Comment content is required")
        @Size(max = 1000, message = "Comment must not exceed 1000 characters")
        String content
) {
}