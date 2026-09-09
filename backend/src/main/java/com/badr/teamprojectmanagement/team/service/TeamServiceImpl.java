package com.badr.teamprojectmanagement.team.service;

import com.badr.teamprojectmanagement.exception.ResourceNotFoundException;
import com.badr.teamprojectmanagement.project.Project;
import com.badr.teamprojectmanagement.project.ProjectRepository;
import com.badr.teamprojectmanagement.team.Team;
import com.badr.teamprojectmanagement.team.TeamRepository;
import com.badr.teamprojectmanagement.team.dtos.TeamCreateRequest;
import com.badr.teamprojectmanagement.team.dtos.TeamResponse;
import com.badr.teamprojectmanagement.team.dtos.TeamUpdateRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class TeamServiceImpl implements TeamService {

    private final TeamRepository teamRepository;
    private final ProjectRepository projectRepository;

    @Override
    public TeamResponse createTeam(TeamCreateRequest request) {

        //Find project
        Project project = projectRepository.findById(request.projectId())
                .orElseThrow(() ->
                        new ResourceNotFoundException("Project not found")
                );

        //Create team
        Team team = Team.builder()
                .project(project)
                .name(request.name())
                .description(request.description())
                .build();

        //Save team
        teamRepository.save(team);

        return mapToResponse(team);
    }

    @Override
    @Transactional(readOnly = true)
    public TeamResponse getTeamById(UUID id) {

        //Find team
        Team team = teamRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Team not found")
                );

        return mapToResponse(team);
    }

    @Override
    @Transactional(readOnly = true)
    public List<TeamResponse> getTeamsByProject(UUID projectId) {

        //Check project exists
        if (!projectRepository.existsById(projectId)) {
            throw new ResourceNotFoundException("Project not found");
        }

        //Find teams
        return teamRepository.findByProjectId(projectId)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public TeamResponse updateTeam(
            UUID id,
            TeamUpdateRequest request
    ) {

        //Find team
        Team team = teamRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Team not found")
                );

        //Update team information
        team.setName(request.name());
        team.setDescription(request.description());

        //Save updated team
        teamRepository.save(team);

        return mapToResponse(team);
    }

    @Override
    public void deleteTeam(UUID id) {

        //Check if team exists
        if (!teamRepository.existsById(id)) {
            throw new ResourceNotFoundException("Team not found");
        }

        //Delete team
        teamRepository.deleteById(id);
    }

    private TeamResponse mapToResponse(Team team) {

        return new TeamResponse(
                team.getId(),
                team.getProject().getId(),
                team.getName(),
                team.getDescription()
        );
    }
}