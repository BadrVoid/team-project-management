package com.badr.teamprojectmanagement.project.service;

import com.badr.teamprojectmanagement.project.dtos.ProjectCreateRequest;
import com.badr.teamprojectmanagement.project.dtos.ProjectDetailsResponse;
import com.badr.teamprojectmanagement.project.dtos.ProjectResponse;
import com.badr.teamprojectmanagement.project.dtos.ProjectUpdateRequest;

import java.util.List;
import java.util.UUID;

public interface ProjectService {

    ProjectResponse createProject(UUID userId, ProjectCreateRequest request);

    ProjectResponse getProjectById(UUID id);

    ProjectDetailsResponse getProjectDetails(UUID id);

    List<ProjectResponse> getProjectsBySpace(UUID spaceId);

    ProjectResponse updateProject(UUID id, ProjectUpdateRequest request);

    void deleteProject(UUID id);
}