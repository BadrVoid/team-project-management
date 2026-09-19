package com.badr.teamprojectmanagement.space.dtos;

import com.badr.teamprojectmanagement.common.enums.Visibility;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record SpaceCreateRequest(

        @NotBlank(message = "Space name is required")
        @Size(max = 100, message = "Space name must not exceed 100 characters")
        String name,

        Visibility visibility,
        @Size(max = 500, message = "Description must not exceed 500 characters")
        String description
) {
}
