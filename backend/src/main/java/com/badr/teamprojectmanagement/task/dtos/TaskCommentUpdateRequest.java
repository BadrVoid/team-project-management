package com.badr.teamprojectmanagement.task.dtos;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record TaskCommentUpdateRequest(

        @NotBlank(message = "Comment content is required")
        @Size(
                max = 5000,
                message = "Comment must not exceed 5000 characters"
        )
        String content

) {}