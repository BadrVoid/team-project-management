
package com.badr.teamprojectmanagement.space.dtos;

import com.badr.teamprojectmanagement.common.enums.RequestStatus;

import java.util.UUID;

public record SpaceJoinRequestResponse(
        UUID id,
        UUID spaceId,
        UUID userId,
        String firstName,
        String lastName,
        String email,
        RequestStatus status
) {
}

