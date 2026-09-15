package com.badr.teamprojectmanagement.user.profile.dtos;

import jakarta.validation.constraints.Size;

import java.util.List;

public record UserProfileRequest(

        @Size(max = 500)
        String bio,

        @Size(max = 255)
        String university,

        @Size(max = 255)
        String department,

        @Size(max = 500)
        String avatarUrl,

        List<String> skills,

        List<String> tags
) {
}