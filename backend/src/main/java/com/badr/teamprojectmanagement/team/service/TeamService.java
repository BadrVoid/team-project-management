package com.badr.teamprojectmanagement.team.service;

import com.badr.teamprojectmanagement.team.dtos.TeamCreateRequest;
import com.badr.teamprojectmanagement.team.dtos.TeamResponse;
import com.badr.teamprojectmanagement.team.dtos.TeamUpdateRequest;

import java.util.List;
import java.util.UUID;

public interface TeamService {

    TeamResponse createTeam(TeamCreateRequest request);

    TeamResponse getTeamById(UUID id);

    List<TeamResponse> getTeamsByProject(UUID projectId);

    TeamResponse updateTeam(UUID id, TeamUpdateRequest request);

    void deleteTeam(UUID id);
}