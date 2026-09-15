package com.badr.teamprojectmanagement.team.service;

import com.badr.teamprojectmanagement.team.dtos.TeamMemberRequest;
import com.badr.teamprojectmanagement.team.dtos.TeamMemberResponse;

import java.util.List;
import java.util.UUID;

public interface TeamMemberService {

    TeamMemberResponse addMember(
            UUID teamId,
            TeamMemberRequest request
    );

    List<TeamMemberResponse> getTeamMembers(UUID teamId);

    TeamMemberResponse updateMemberRole(
            UUID teamId,
            UUID userId,
            TeamMemberRequest request
    );

    void removeMember(UUID teamId, UUID userId);
}