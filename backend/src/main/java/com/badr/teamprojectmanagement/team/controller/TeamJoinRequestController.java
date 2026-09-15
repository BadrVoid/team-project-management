package com.badr.teamprojectmanagement.team.controller;

import com.badr.teamprojectmanagement.common.response.GlobalResponse;
import com.badr.teamprojectmanagement.team.dtos.TeamJoinRequestResponse;
import com.badr.teamprojectmanagement.team.service.TeamJoinRequestService;
import com.badr.teamprojectmanagement.user.User;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/team-join-requests")
@RequiredArgsConstructor
public class TeamJoinRequestController {

    private final TeamJoinRequestService teamJoinRequestService;

    // JOIN REQUEST

    @PostMapping("/team/{teamId}")
    @ResponseStatus(HttpStatus.CREATED)
    public GlobalResponse<TeamJoinRequestResponse> sendJoinRequest(
            @PathVariable UUID teamId,
            @AuthenticationPrincipal User user
    ) {

        TeamJoinRequestResponse response =
                teamJoinRequestService.sendJoinRequest(
                        teamId,
                        user.getId()
                );

        return GlobalResponse.success(
                "Team join request sent successfully",
                response
        );
    }

    @GetMapping("/team/{teamId}")
    public GlobalResponse<List<TeamJoinRequestResponse>>
    getTeamJoinRequests(
            @PathVariable UUID teamId,
            @AuthenticationPrincipal User user
    ) {

        List<TeamJoinRequestResponse> response =
                teamJoinRequestService.getTeamJoinRequests(
                        teamId,
                        user.getId()
                );

        return GlobalResponse.success(
                "Team join requests retrieved successfully",
                response
        );
    }

    @PatchMapping("/{requestId}/accept")
    public GlobalResponse<TeamJoinRequestResponse> acceptJoinRequest(
            @PathVariable UUID requestId,
            @AuthenticationPrincipal User user
    ) {

        TeamJoinRequestResponse response =
                teamJoinRequestService.acceptJoinRequest(
                        requestId,
                        user.getId()
                );

        return GlobalResponse.success(
                "Team join request accepted successfully",
                response
        );
    }

    @PatchMapping("/{requestId}/reject")
    public GlobalResponse<TeamJoinRequestResponse> rejectJoinRequest(
            @PathVariable UUID requestId,
            @AuthenticationPrincipal User user
    ) {

        TeamJoinRequestResponse response =
                teamJoinRequestService.rejectJoinRequest(
                        requestId,
                        user.getId()
                );

        return GlobalResponse.success(
                "Team join request rejected successfully",
                response
        );
    }

    // INVITATIONS

    @PostMapping("/team/{teamId}/invite/{userId}")
    @ResponseStatus(HttpStatus.CREATED)
    public GlobalResponse<TeamJoinRequestResponse> inviteUser(
            @PathVariable UUID teamId,
            @PathVariable UUID userId,
            @AuthenticationPrincipal User user
    ) {

        TeamJoinRequestResponse response =
                teamJoinRequestService.inviteUser(
                        teamId,
                        userId,
                        user.getId()
                );

        return GlobalResponse.success(
                "Team invitation sent successfully",
                response
        );
    }

    @GetMapping("/my-invitations")
    public GlobalResponse<List<TeamJoinRequestResponse>>
    getMyInvitations(
            @AuthenticationPrincipal User user
    ) {

        List<TeamJoinRequestResponse> response =
                teamJoinRequestService.getMyInvitations(
                        user.getId()
                );

        return GlobalResponse.success(
                "Team invitations retrieved successfully",
                response
        );
    }

    @PatchMapping("/{requestId}/accept-invitation")
    public GlobalResponse<TeamJoinRequestResponse> acceptInvitation(
            @PathVariable UUID requestId,
            @AuthenticationPrincipal User user
    ) {

        TeamJoinRequestResponse response =
                teamJoinRequestService.acceptInvitation(
                        requestId,
                        user.getId()
                );

        return GlobalResponse.success(
                "Team invitation accepted successfully",
                response
        );
    }

    @PatchMapping("/{requestId}/reject-invitation")
    public GlobalResponse<TeamJoinRequestResponse> rejectInvitation(
            @PathVariable UUID requestId,
            @AuthenticationPrincipal User user
    ) {

        TeamJoinRequestResponse response =
                teamJoinRequestService.rejectInvitation(
                        requestId,
                        user.getId()
                );

        return GlobalResponse.success(
                "Team invitation rejected successfully",
                response
        );
    }
}