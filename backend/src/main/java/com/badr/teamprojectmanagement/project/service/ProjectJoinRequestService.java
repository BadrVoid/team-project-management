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
            UUID projectId,
            UUID currentUserId
    );

    ProjectJoinRequestResponse acceptJoinRequest(
            UUID requestId,
            UUID currentUserId
    );

    ProjectJoinRequestResponse rejectJoinRequest(
            UUID requestId,
            UUID currentUserId
    );

    ProjectJoinRequestResponse inviteUser(
            UUID projectId,
            UUID userId,
            UUID currentUserId
    );

    List<ProjectJoinRequestResponse> getMyInvitations(
            UUID userId
    );

    ProjectJoinRequestResponse acceptInvitation(
            UUID requestId,
            UUID userId
    );

    ProjectJoinRequestResponse rejectInvitation(
            UUID requestId,
            UUID userId
    );
}