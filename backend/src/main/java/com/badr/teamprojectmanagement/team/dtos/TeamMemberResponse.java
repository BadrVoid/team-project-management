package com.badr.teamprojectmanagement.team.dtos;

import com.badr.teamprojectmanagement.common.enums.RequestStatus;
import com.badr.teamprojectmanagement.common.enums.TeamMemberRole;

import java.util.UUID;

public record TeamMemberResponse(
        UUID id,
        UUID teamId,
        UUID userId,
        String firstName,
        String lastName,
        String email,
        TeamMemberRole role,
        RequestStatus status
) {}