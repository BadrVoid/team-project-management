package com.badr.teamprojectmanagement.project.dtos;

import com.badr.teamprojectmanagement.common.enums.MembershipStatus;
import com.badr.teamprojectmanagement.common.enums.ProjectMemberRole;

import java.util.UUID;

public record ProjectMemberResponse(
        UUID id,
        UUID projectId,
        UUID userId,
        ProjectMemberRole role,
        MembershipStatus status
) {}