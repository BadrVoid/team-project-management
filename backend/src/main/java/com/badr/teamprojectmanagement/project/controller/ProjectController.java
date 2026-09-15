package com.badr.teamprojectmanagement.project.controller;

import com.badr.teamprojectmanagement.common.response.GlobalResponse;
import com.badr.teamprojectmanagement.project.dtos.ProjectCreateRequest;
import com.badr.teamprojectmanagement.project.dtos.ProjectDetailsResponse;
import com.badr.teamprojectmanagement.project.dtos.ProjectResponse;
import com.badr.teamprojectmanagement.project.dtos.ProjectUpdateRequest;
import com.badr.teamprojectmanagement.project.service.ProjectService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/projects")
@RequiredArgsConstructor
public class ProjectController {

    private final ProjectService projectService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public GlobalResponse<ProjectResponse> createProject(
            @RequestParam UUID userId,
            @Valid @RequestBody ProjectCreateRequest request
    ) {
        ProjectResponse response =
                projectService.createProject(userId, request);

        return GlobalResponse.success(
                "Project created successfully",
                response
        );
    }

    @GetMapping("/{id}/details")
    public GlobalResponse<ProjectDetailsResponse> getProjectDetails(
            @PathVariable UUID id
    ) {
        ProjectDetailsResponse response =
                projectService.getProjectDetails(id);

        return GlobalResponse.success(
                "Project details retrieved successfully",
                response
        );
    }

    @GetMapping("/{id}")
    public GlobalResponse<ProjectResponse> getProjectById(
            @PathVariable UUID id
    ) {
        ProjectResponse response =
                projectService.getProjectById(id);

        return GlobalResponse.success(
                "Project retrieved successfully",
                response
        );
    }

    @GetMapping("/space/{spaceId}")
    public GlobalResponse<List<ProjectResponse>> getProjectsBySpace(
            @PathVariable UUID spaceId
    ) {
        List<ProjectResponse> response =
                projectService.getProjectsBySpace(spaceId);

        return GlobalResponse.success(
                "Projects retrieved successfully",
                response
        );
    }

    @PutMapping("/{id}")
    public GlobalResponse<ProjectResponse> updateProject(
            @PathVariable UUID id,
            @Valid @RequestBody ProjectUpdateRequest request
    ) {
        ProjectResponse response =
                projectService.updateProject(id, request);

        return GlobalResponse.success(
                "Project updated successfully",
                response
        );
    }

    @DeleteMapping("/{id}")
    public GlobalResponse<Void> deleteProject(
            @PathVariable UUID id
    ) {
        projectService.deleteProject(id);

        return GlobalResponse.success(
                "Project deleted successfully",
                null
        );
    }
}