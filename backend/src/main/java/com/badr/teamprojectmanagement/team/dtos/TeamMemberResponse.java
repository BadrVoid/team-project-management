package com.badr.teamprojectmanagement.team.dtos;

import com.badr.teamprojectmanagement.common.enums.TeamMemberRole;

import java.util.UUID;

public record TeamMemberResponse(
        UUID id,
        UUID teamId,
        UUID userId,
        TeamMemberRole role
) {}