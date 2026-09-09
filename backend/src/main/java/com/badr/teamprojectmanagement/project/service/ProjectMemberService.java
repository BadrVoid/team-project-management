package com.badr.teamprojectmanagement.project.service;

import com.badr.teamprojectmanagement.project.dtos.ProjectMemberRequest;
import com.badr.teamprojectmanagement.project.dtos.ProjectMemberResponse;

import java.util.List;
import java.util.UUID;

public interface ProjectMemberService {

    ProjectMemberResponse inviteMember(UUID projectId, ProjectMemberRequest request);

    List<ProjectMemberResponse> getProjectMembers(UUID projectId);

    List<ProjectMemberResponse> getMyInvitations(UUID userId);

    ProjectMemberResponse acceptInvitation(UUID projectId, UUID userId);

    ProjectMemberResponse rejectInvitation(UUID projectId, UUID userId);

    ProjectMemberResponse updateMemberRole(UUID projectId, UUID userId, ProjectMemberRequest request);

    void removeMember(UUID projectId, UUID userId);
}