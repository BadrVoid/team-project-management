package com.badr.teamprojectmanagement.space.dtos;

import com.badr.teamprojectmanagement.common.enums.SpaceMembershipStatus;
import com.badr.teamprojectmanagement.common.enums.Visibility;

import java.util.UUID;

public record PublicSpaceResponse(
        UUID id,
        String name,
        String description,
        Visibility visibility,
        UUID ownerId,
        SpaceMembershipStatus membershipStatus
) {
}