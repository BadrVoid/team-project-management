package com.badr.teamprojectmanagement.project.service;

import com.badr.teamprojectmanagement.project.dtos.ProjectJoinRequestResponse;

import java.util.List;
import java.util.UUID;

public interface ProjectJoinRequestService {

    ProjectJoinRequestResponse sendJoinRequest(
            UUID projectId,
            UUID userId
    );

    List<ProjectJoinRequestResponse> getProjectJoinRequests(
            UUID projectId
    );

    ProjectJoinRequestResponse acceptJoinRequest(
            UUID requestId
    );

    ProjectJoinRequestResponse rejectJoinRequest(
            UUID requestId
    );
}