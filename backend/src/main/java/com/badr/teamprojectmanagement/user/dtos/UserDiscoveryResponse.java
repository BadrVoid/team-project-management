package com.badr.teamprojectmanagement.user.dtos;

import com.badr.teamprojectmanagement.common.enums.UserRole;

import java.util.List;
import java.util.UUID;

public record UserDiscoveryResponse(

        UUID id,

        String firstName,

        String lastName,

        UserRole role,

        String bio,

        String avatarUrl,

        List<String> skills,

        List<String> tags
) {
}