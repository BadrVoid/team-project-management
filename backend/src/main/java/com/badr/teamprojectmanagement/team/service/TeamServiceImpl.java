package com.badr.teamprojectmanagement.team.service;

import com.badr.teamprojectmanagement.common.enums.ProjectMemberRole;
import com.badr.teamprojectmanagement.common.enums.RequestStatus;
import com.badr.teamprojectmanagement.common.enums.UserRole;
import com.badr.teamprojectmanagement.exception.ForbiddenException;
import com.badr.teamprojectmanagement.exception.ResourceNotFoundException;
import com.badr.teamprojectmanagement.project.Project;
import com.badr.teamprojectmanagement.project.ProjectMember;
import com.badr.teamprojectmanagement.project.ProjectMemberRepository;
import com.badr.teamprojectmanagement.project.ProjectRepository;
import com.badr.teamprojectmanagement.project.dtos.ProjectMemberRequest;
import com.badr.teamprojectmanagement.security.SecurityUtils;
import com.badr.teamprojectmanagement.team.Team;
import com.badr.teamprojectmanagement.team.TeamRepository;
import com.badr.teamprojectmanagement.team.dtos.TeamCreateRequest;
import com.badr.teamprojectmanagement.team.dtos.TeamResponse;
import com.badr.teamprojectmanagement.team.dtos.TeamUpdateRequest;
import com.badr.teamprojectmanagement.user.User;
import com.badr.teamprojectmanagement.user.UserRepository;
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
    private final ProjectMemberRepository projectMemberRepository;
    private final UserRepository userRepository;

    @Override
    public TeamResponse createTeam(TeamCreateRequest request) {

        Project project = projectRepository.findById(request.projectId())
                .orElseThrow(() -> new ResourceNotFoundException("Project not found"));

        checkProjectTeamManagementPermission(project);

        Team team = Team.builder()
                .project(project)
                .name(request.name())
                .description(request.description())
                .build();

        teamRepository.save(team);

        return mapToResponse(team);
    }

    @Override
    @Transactional(readOnly = true)
    public TeamResponse getTeamById(UUID id) {

        Team team = teamRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Team not found"));

        return mapToResponse(team);
    }

    @Override
    @Transactional(readOnly = true)
    public List<TeamResponse> getTeamsByProject(UUID projectId) {

        if (!projectRepository.existsById(projectId)) {
            throw new ResourceNotFoundException("Project not found");
        }

        return teamRepository.findByProjectId(projectId)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public TeamResponse updateTeam(UUID id, TeamUpdateRequest request) {

        Team team = teamRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Team not found"));

        checkProjectTeamManagementPermission(team.getProject());

        team.setName(request.name());
        team.setDescription(request.description());

        teamRepository.save(team);

        return mapToResponse(team);
    }

    @Override
    public void deleteTeam(UUID id) {

        Team team = teamRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Team not found"));

        checkProjectTeamManagementPermission(team.getProject());

        teamRepository.delete(team);
    }

    private void checkProjectTeamManagementPermission(Project project) {

        UUID currentUserId = SecurityUtils.getCurrentUserId();

        User currentUser = userRepository.findById(currentUserId)
                .orElseThrow(() -> new ResourceNotFoundException("Current user not found"));

        /*
         * ADMIN can manage any team.
         */
        if (currentUser.getRole() == UserRole.ADMIN) {
            return;
        }

        /*
         * Project owner can manage teams.
         */
        if (project.getCreatedBy().getId().equals(currentUserId)) {
            return;
        }

        /*
         * Otherwise the user must be an accepted
         * PROJECT OWNER or MANAGER.
         */
        ProjectMember member = projectMemberRepository
                .findByProjectIdAndUserId(project.getId(), currentUserId)
                .orElseThrow(() ->
                        new ForbiddenException(
                                "You do not have permission to manage teams in this project"
                        )
                );

        if (member.getStatus() != RequestStatus.ACCEPTED) {
            throw new ForbiddenException(
                    "You do not have permission to manage teams in this project"
            );
        }

        if (member.getRole() != ProjectMemberRole.OWNER
                && member.getRole() != ProjectMemberRole.MANAGER) {

            throw new ForbiddenException(
                    "Only the project owner or manager can manage teams"
            );
        }
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