
package com.badr.teamprojectmanagement.project.service;

import com.badr.teamprojectmanagement.common.enums.ProjectMemberRole;
import com.badr.teamprojectmanagement.common.enums.RequestStatus;
import com.badr.teamprojectmanagement.common.enums.UserRole;
import com.badr.teamprojectmanagement.exception.ForbiddenException;
import com.badr.teamprojectmanagement.exception.ResourceNotFoundException;
import com.badr.teamprojectmanagement.project.Project;
import com.badr.teamprojectmanagement.project.ProjectMapper;
import com.badr.teamprojectmanagement.project.ProjectMember;
import com.badr.teamprojectmanagement.project.ProjectMemberRepository;
import com.badr.teamprojectmanagement.project.ProjectRepository;
import com.badr.teamprojectmanagement.project.dtos.*;
import com.badr.teamprojectmanagement.security.SecurityUtils;
import com.badr.teamprojectmanagement.space.Space;
import com.badr.teamprojectmanagement.space.SpaceRepository;
import com.badr.teamprojectmanagement.task.TaskCommentRepository;
import com.badr.teamprojectmanagement.task.TaskRepository;
import com.badr.teamprojectmanagement.team.TeamMemberRepository;
import com.badr.teamprojectmanagement.team.TeamRepository;
import com.badr.teamprojectmanagement.team.dtos.TeamSummaryResponse;
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
public class ProjectServiceImpl implements ProjectService {

    private final ProjectRepository projectRepository;
    private final SpaceRepository spaceRepository;
    private final UserRepository userRepository;
    private final TeamRepository teamRepository;
    private final ProjectMemberRepository projectMemberRepository;
    private final ProjectMapper projectMapper;
    private final TeamMemberRepository teamMemberRepository;
    private final TaskRepository taskRepository;
    private final TaskCommentRepository taskCommentRepository;

    @Override
    public ProjectResponse createProject(ProjectCreateRequest request) {

        UUID userId = SecurityUtils.getCurrentUserId();

        // Find space
        Space space = spaceRepository
                .findById(request.spaceId())
                .orElseThrow(() ->
                        new ResourceNotFoundException("Space not found")
                );

        // Find creator
        User creator = userRepository
                .findById(userId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found")
                );

        // Create project
        Project project = Project.builder()
                .space(space)
                .name(request.name())
                .description(request.description())
                .status(
                        request.status() != null
                                ? request.status()
                                : com.badr.teamprojectmanagement.common.enums.ProjectStatus.PLANNING
                )
                .startDate(request.startDate())
                .endDate(request.endDate())
                .createdBy(creator)
                .build();

        projectRepository.save(project);

        // Add creator as project owner
        ProjectMember ownerMembership = ProjectMember.builder()
                .project(project)
                .user(creator)
                .role(ProjectMemberRole.OWNER)
                .status(RequestStatus.ACCEPTED)
                .build();

        projectMemberRepository.save(ownerMembership);

        return mapToResponse(project);
    }

    @Override
    @Transactional(readOnly = true)
    public ProjectResponse getProjectById(UUID id) {

        Project project = projectRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Project not found")
                );

        return mapToResponse(project);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProjectResponse> getProjectsBySpace(UUID spaceId) {

        Space space = spaceRepository.findById(spaceId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Space not found")
                );

        return projectRepository.findBySpace(space)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public ProjectResponse updateProject(
            UUID id,
            ProjectUpdateRequest request
    ) {

        Project project = projectRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Project not found")
                );

        UUID currentUserId = SecurityUtils.getCurrentUserId();

        checkUpdatePermission(project, currentUserId);

        // Update project information
        project.setName(request.name());
        project.setDescription(request.description());
        project.setStatus(request.status());
        project.setStartDate(request.startDate());
        project.setEndDate(request.endDate());

        return mapToResponse(project);
    }

    @Override
    public void deleteProject(UUID id) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found"));

        UUID currentUserId = SecurityUtils.getCurrentUserId();
        checkDeletePermission(project, currentUserId);

        // 1. Delete task comments
        taskCommentRepository.deleteByProjectId(id);

        // 2. Delete tasks
        taskRepository.deleteByProjectId(id);

        // 3. Delete project members
        projectMemberRepository.deleteByProjectId(id);

        // 4. Delete team members
        teamMemberRepository.deleteByProjectId(id);

        // 5. Delete teams
        teamRepository.deleteByProjectId(id);

        // 6. Delete project
        projectRepository.delete(project);
    }






    @Override
    @Transactional(readOnly = true)
    public ProjectDetailsResponse getProjectDetails(UUID id) {

        Project project = projectRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Project not found")
                );

        List<ProjectMemberResponse> members =
                projectMemberRepository.findByProject(project)
                        .stream()
                        .map(projectMapper::toMemberResponse)
                        .toList();

        List<TeamSummaryResponse> teams =
                teamRepository.findByProjectId(project.getId())
                        .stream()
                        .map(projectMapper::toTeamSummaryResponse)
                        .toList();

        return projectMapper.toDetailsResponse(
                project,
                members,
                teams
        );
    }

    private void checkUpdatePermission(
            Project project,
            UUID currentUserId
    ) {

        User currentUser = userRepository.findById(currentUserId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Current user not found"
                        )
                );

        if (currentUser.getRole() == UserRole.ADMIN) {
            return;
        }

        if (project.getCreatedBy()
                .getId()
                .equals(currentUserId)) {
            return;
        }

        ProjectMember member =
                projectMemberRepository
                        .findByProjectIdAndUserId(
                                project.getId(),
                                currentUserId
                        )
                        .orElseThrow(() ->
                                new ForbiddenException(
                                        "You are not a member of this project"
                                )
                        );

        if (member.getStatus() != RequestStatus.ACCEPTED) {
            throw new ForbiddenException(
                    "Your project membership is not active"
            );
        }

        // MANAGER
        if (member.getRole() == ProjectMemberRole.MANAGER) {
            return;
        }

        throw new ForbiddenException(
                "You do not have permission to update this project"
        );
    }

    private void checkDeletePermission(
            Project project,
            UUID currentUserId
    ) {

        User currentUser = userRepository.findById(currentUserId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Current user not found"
                        )
                );

        // ADMIN
        if (currentUser.getRole() == UserRole.ADMIN) {
            return;
        }

        // Project OWNER
        if (project.getCreatedBy()
                .getId()
                .equals(currentUserId)) {
            return;
        }

        throw new ForbiddenException(
                "Only the project owner or admin can delete this project"
        );
    }

    private ProjectResponse mapToResponse(
            Project project
    ) {

        return new ProjectResponse(
                project.getId(),
                project.getSpace().getId(),
                project.getName(),
                project.getDescription(),
                project.getStatus(),
                project.getStartDate(),
                project.getEndDate(),
                project.getCreatedBy().getId()
        );
    }
}

