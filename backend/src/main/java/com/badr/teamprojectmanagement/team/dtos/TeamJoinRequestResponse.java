package com.badr.teamprojectmanagement.team.dtos;

import com.badr.teamprojectmanagement.common.enums.TeamJoinRequestStatus;

import java.util.UUID;

public record TeamJoinRequestResponse(
        UUID id,
        UUID teamId,
        UUID userId,
        TeamJoinRequestStatus status
) {
}