package com.badr.teamprojectmanagement.project.dtos;

import com.badr.teamprojectmanagement.common.enums.ProjectStatus;
import com.badr.teamprojectmanagement.team.dtos.TeamSummaryResponse;
import com.badr.teamprojectmanagement.user.dtos.UserSummaryResponse;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

public record ProjectDetailsResponse(
        UUID id,
        String name,
        String description,
        ProjectStatus status,
        LocalDate startDate,
        LocalDate endDate,
        UserSummaryResponse createdBy,
        List<ProjectMemberResponse> members,
        List<TeamSummaryResponse> teams
) {}
