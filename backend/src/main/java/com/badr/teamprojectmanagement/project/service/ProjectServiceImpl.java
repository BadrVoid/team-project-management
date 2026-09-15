package com.badr.teamprojectmanagement.project.service;

import com.badr.teamprojectmanagement.common.enums.ProjectStatus;
import com.badr.teamprojectmanagement.exception.ResourceNotFoundException;
import com.badr.teamprojectmanagement.project.Project;
import com.badr.teamprojectmanagement.project.ProjectMapper;
import com.badr.teamprojectmanagement.project.ProjectMemberRepository;
import com.badr.teamprojectmanagement.project.ProjectRepository;
import com.badr.teamprojectmanagement.project.dtos.*;
import com.badr.teamprojectmanagement.space.Space;
import com.badr.teamprojectmanagement.space.SpaceRepository;
import com.badr.teamprojectmanagement.team.TeamRepository;
import com.badr.teamprojectmanagement.team.dtos.TeamSummaryResponse;
import com.badr.teamprojectmanagement.user.User;
import com.badr.teamprojectmanagement.user.UserRepository;
import com.badr.teamprojectmanagement.user.dtos.UserSummaryResponse;
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

    @Override
    public ProjectResponse createProject(
            UUID userId,
            ProjectCreateRequest request
    ) {

        //Find space
        Space space = spaceRepository.findById(request.spaceId())
                .orElseThrow(() ->
                        new ResourceNotFoundException("Space not found")
                );

        //Find creator
        User creator = userRepository.findById(userId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found")
                );

        //Create project
        Project project = Project.builder()
                .space(space)
                .name(request.name())
                .description(request.description())
                .status(
                        request.status() != null
                                ? request.status()
                                : ProjectStatus.PLANNING
                )
                .startDate(request.startDate())
                .endDate(request.endDate())
                .createdBy(creator)
                .build();

        //Save project
        projectRepository.save(project);

        return mapToResponse(project);
    }

    @Override
    @Transactional(readOnly = true)
    public ProjectResponse getProjectById(UUID id) {

        //Find project
        Project project = projectRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Project not found")
                );

        return mapToResponse(project);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProjectResponse> getProjectsBySpace(UUID spaceId) {

        //Find space
        Space space = spaceRepository.findById(spaceId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Space not found")
                );

        //Find projects
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

        //Find project
        Project project = projectRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Project not found")
                );

        //Update project information
        project.setName(request.name());
        project.setDescription(request.description());
        project.setStatus(request.status());
        project.setStartDate(request.startDate());
        project.setEndDate(request.endDate());

        return mapToResponse(project);
    }

    @Override
    public void deleteProject(UUID id) {

        //Check if project exists
        if (!projectRepository.existsById(id)) {
            throw new ResourceNotFoundException("Project not found");
        }

        //Delete project
        projectRepository.deleteById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public ProjectDetailsResponse getProjectDetails(UUID id) {

        Project project = projectRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Project not found"));

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
    private ProjectResponse mapToResponse(Project project) {

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