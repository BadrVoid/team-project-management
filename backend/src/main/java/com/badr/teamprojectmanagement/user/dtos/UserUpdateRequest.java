package com.badr.teamprojectmanagement.user.dtos;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record UserUpdateRequest(

        @NotBlank(message = "First name is required")
        @Size(max = 50, message = "First name must not exceed 50 characters")
        String firstName,

        @NotBlank(message = "Last name is required")
        @Size(max = 50, message = "Last name must not exceed 50 characters")
        String lastName
) {
}