package com.badr.teamprojectmanagement.user.dtos;

import com.badr.teamprojectmanagement.common.enums.UserRole;

import java.util.UUID;

public record UserResponse(

        UUID id,

        String firstName,

        String lastName,

        String email,

        UserRole role,

        boolean emailVerified
) {
}