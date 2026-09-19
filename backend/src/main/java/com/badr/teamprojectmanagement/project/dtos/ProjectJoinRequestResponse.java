package com.badr.teamprojectmanagement.project.dtos;

import com.badr.teamprojectmanagement.common.enums.RequestStatus;
import lombok.Builder;

import java.util.UUID;

@Builder
public record ProjectJoinRequestResponse(
        UUID id,
        UUID projectId,
        UUID userId,
        RequestStatus status
) {
}
