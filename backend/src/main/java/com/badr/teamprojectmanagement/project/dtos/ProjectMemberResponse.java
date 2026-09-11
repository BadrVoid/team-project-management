package com.badr.teamprojectmanagement.project.dtos;

import com.badr.teamprojectmanagement.common.enums.MembershipStatus;
import com.badr.teamprojectmanagement.common.enums.ProjectMemberRole;

import java.util.UUID;

public record ProjectMemberResponse(
        UUID id,
        UUID userId,
        String firstName,
        String lastName,
        ProjectMemberRole role,
        MembershipStatus status
) {}