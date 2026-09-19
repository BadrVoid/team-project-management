
package com.badr.teamprojectmanagement.user.profile.dtos;

import com.badr.teamprojectmanagement.auth.AuthProvider;
import com.badr.teamprojectmanagement.common.enums.UserRole;

import java.util.List;
import java.util.UUID;

public record UserProfileResponse(

        UUID userId,

        String firstName,

        String lastName,

        String email,

        UserRole role,

        AuthProvider authProvider,

        String bio,

        String university,

        String department,

        String avatarUrl,

        List<String> skills,

        List<String> tags
) {
}

