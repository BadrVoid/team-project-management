
package com.badr.teamprojectmanagement.project.controller;

import com.badr.teamprojectmanagement.common.response.GlobalResponse;
import com.badr.teamprojectmanagement.project.dtos.ProjectJoinRequestResponse;
import com.badr.teamprojectmanagement.project.service.ProjectJoinRequestService;
import com.badr.teamprojectmanagement.user.User;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/project-join-requests")
@RequiredArgsConstructor
public class ProjectJoinRequestController {

    private final ProjectJoinRequestService projectJoinRequestService;


    // JOIN REQUEST


    @PostMapping("/project/{projectId}")
    @ResponseStatus(HttpStatus.CREATED)
    public GlobalResponse<ProjectJoinRequestResponse> sendJoinRequest(
            @PathVariable UUID projectId,
            @AuthenticationPrincipal User user
    ) {

        ProjectJoinRequestResponse response =
                projectJoinRequestService.sendJoinRequest(
                        projectId,
                        user.getId()
                );

        return GlobalResponse.success(
                "Project join request sent successfully",
                response
        );
    }

    @GetMapping("/project/{projectId}")
    public GlobalResponse<List<ProjectJoinRequestResponse>>
    getProjectJoinRequests(
            @PathVariable UUID projectId,
            @AuthenticationPrincipal User user
    ) {

        List<ProjectJoinRequestResponse> response =
                projectJoinRequestService.getProjectJoinRequests(
                        projectId,
                        user.getId()
                );

        return GlobalResponse.success(
                "Project join requests retrieved successfully",
                response
        );
    }

    @PatchMapping("/{requestId}/accept")
    public GlobalResponse<ProjectJoinRequestResponse> acceptJoinRequest(
            @PathVariable UUID requestId,
            @AuthenticationPrincipal User user
    ) {

        ProjectJoinRequestResponse response =
                projectJoinRequestService.acceptJoinRequest(
                        requestId,
                        user.getId()
                );

        return GlobalResponse.success(
                "Project join request accepted successfully",
                response
        );
    }

    @PatchMapping("/{requestId}/reject")
    public GlobalResponse<ProjectJoinRequestResponse> rejectJoinRequest(
            @PathVariable UUID requestId,
            @AuthenticationPrincipal User user
    ) {

        ProjectJoinRequestResponse response =
                projectJoinRequestService.rejectJoinRequest(
                        requestId,
                        user.getId()
                );

        return GlobalResponse.success(
                "Project join request rejected successfully",
                response
        );
    }


    // INVITATIONS


    @PostMapping("/project/{projectId}/invite/{userId}")
    @ResponseStatus(HttpStatus.CREATED)
    public GlobalResponse<ProjectJoinRequestResponse> inviteUser(
            @PathVariable UUID projectId,
            @PathVariable UUID userId,
            @AuthenticationPrincipal User user
    ) {

        ProjectJoinRequestResponse response =
                projectJoinRequestService.inviteUser(
                        projectId,
                        userId,
                        user.getId()
                );

        return GlobalResponse.success(
                "Project invitation sent successfully",
                response
        );
    }

    @GetMapping("/my-invitations")
    public GlobalResponse<List<ProjectJoinRequestResponse>>
    getMyInvitations(
            @AuthenticationPrincipal User user
    ) {

        List<ProjectJoinRequestResponse> response =
                projectJoinRequestService.getMyInvitations(
                        user.getId()
                );

        return GlobalResponse.success(
                "Project invitations retrieved successfully",
                response
        );
    }

    @PatchMapping("/{requestId}/accept-invitation")
    public GlobalResponse<ProjectJoinRequestResponse> acceptInvitation(
            @PathVariable UUID requestId,
            @AuthenticationPrincipal User user
    ) {

        ProjectJoinRequestResponse response =
                projectJoinRequestService.acceptInvitation(
                        requestId,
                        user.getId()
                );

        return GlobalResponse.success(
                "Project invitation accepted successfully",
                response
        );
    }

    @PatchMapping("/{requestId}/reject-invitation")
    public GlobalResponse<ProjectJoinRequestResponse> rejectInvitation(
            @PathVariable UUID requestId,
            @AuthenticationPrincipal User user
    ) {

        ProjectJoinRequestResponse response =
                projectJoinRequestService.rejectInvitation(
                        requestId,
                        user.getId()
                );

        return GlobalResponse.success(
                "Project invitation rejected successfully",
                response
        );
    }
}

