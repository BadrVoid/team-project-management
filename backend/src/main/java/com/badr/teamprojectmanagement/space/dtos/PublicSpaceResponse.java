package com.badr.teamprojectmanagement.space.dtos;

import com.badr.teamprojectmanagement.common.enums.RequestStatus;
import com.badr.teamprojectmanagement.common.enums.Visibility;

import java.util.UUID;

public record PublicSpaceResponse(
        UUID id,
        String name,
        String description,
        Visibility visibility,
        UUID ownerId,
        RequestStatus RequestStatus
) {
}
