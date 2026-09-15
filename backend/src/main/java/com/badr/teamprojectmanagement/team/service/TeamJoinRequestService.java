package com.badr.teamprojectmanagement.team.service;

import com.badr.teamprojectmanagement.team.dtos.TeamJoinRequestResponse;

import java.util.List;
import java.util.UUID;

public interface TeamJoinRequestService {

    TeamJoinRequestResponse sendJoinRequest(
            UUID teamId,
            UUID userId
    );

    List<TeamJoinRequestResponse> getTeamJoinRequests(
            UUID teamId,
            UUID currentUserId
    );

    TeamJoinRequestResponse acceptJoinRequest(
            UUID requestId,
            UUID currentUserId
    );

    TeamJoinRequestResponse rejectJoinRequest(
            UUID requestId,
            UUID currentUserId
    );

    TeamJoinRequestResponse inviteUser(
            UUID teamId,
            UUID userId,
            UUID currentUserId
    );

    List<TeamJoinRequestResponse> getMyInvitations(
            UUID userId
    );

    TeamJoinRequestResponse acceptInvitation(
            UUID requestId,
            UUID userId
    );

    TeamJoinRequestResponse rejectInvitation(
            UUID requestId,
            UUID userId
    );
}