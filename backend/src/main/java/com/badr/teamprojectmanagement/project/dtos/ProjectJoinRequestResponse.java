package com.badr.teamprojectmanagement.project.dtos;

import com.badr.teamprojectmanagement.common.enums.JoinRequestStatus;
import lombok.Builder;

import java.util.UUID;

@Builder
public record ProjectJoinRequestResponse(
        UUID id,
        UUID projectId,
        UUID userId,
        JoinRequestStatus status
) {
}