
package com.badr.teamprojectmanagement.project;

import com.badr.teamprojectmanagement.common.response.GlobalResponse;
import com.badr.teamprojectmanagement.project.dtos.ProjectMemberRequest;
import com.badr.teamprojectmanagement.project.dtos.ProjectMemberResponse;
import com.badr.teamprojectmanagement.project.service.ProjectMemberService;
import com.badr.teamprojectmanagement.user.User;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/projects")
@RequiredArgsConstructor
public class ProjectMemberController {

    private final ProjectMemberService projectMemberService;

    @PostMapping("/{projectId}/members")
    @ResponseStatus(HttpStatus.CREATED)
    public GlobalResponse<ProjectMemberResponse> inviteMember(
            @PathVariable UUID projectId,
            @Valid @RequestBody ProjectMemberRequest request,
            @AuthenticationPrincipal User currentUser
    ) {

        ProjectMemberResponse response =
                projectMemberService.inviteMember(
                        projectId,
                        currentUser.getId(),
                        request
                );

        return GlobalResponse.success(
                "Project member invited successfully",
                response
        );
    }

    @GetMapping("/{projectId}/members")
    public GlobalResponse<List<ProjectMemberResponse>> getProjectMembers(
            @PathVariable UUID projectId
    ) {

        List<ProjectMemberResponse> response =
                projectMemberService.getProjectMembers(projectId);

        return GlobalResponse.success(
                "Project members retrieved successfully",
                response
        );
    }

    @GetMapping("/invitations/{userId}")
    public GlobalResponse<List<ProjectMemberResponse>> getMyInvitations(
            @PathVariable UUID userId,
            @AuthenticationPrincipal User currentUser
    ) {

        // User can only retrieve their own invitations
        if (!currentUser.getId().equals(userId)) {
            throw new com.badr.teamprojectmanagement.exception.ForbiddenException(
                    "You can only view your own invitations"
            );
        }

        List<ProjectMemberResponse> response =
                projectMemberService.getMyInvitations(
                        currentUser.getId()
                );

        return GlobalResponse.success(
                "Project invitations retrieved successfully",
                response
        );
    }

    @PatchMapping("/{projectId}/members/{userId}/accept")
    public GlobalResponse<ProjectMemberResponse> acceptInvitation(
            @PathVariable UUID projectId,
            @PathVariable UUID userId,
            @AuthenticationPrincipal User currentUser
    ) {

        if (!currentUser.getId().equals(userId)) {
            throw new com.badr.teamprojectmanagement.exception.ForbiddenException(
                    "You can only accept your own invitation"
            );
        }

        ProjectMemberResponse response =
                projectMemberService.acceptInvitation(
                        projectId,
                        currentUser.getId()
                );

        return GlobalResponse.success(
                "Project invitation accepted successfully",
                response
        );
    }

    @PatchMapping("/{projectId}/members/{userId}/reject")
    public GlobalResponse<ProjectMemberResponse> rejectInvitation(
            @PathVariable UUID projectId,
            @PathVariable UUID userId,
            @AuthenticationPrincipal User currentUser
    ) {

        if (!currentUser.getId().equals(userId)) {
            throw new com.badr.teamprojectmanagement.exception.ForbiddenException(
                    "You can only reject your own invitation"
            );
        }

        ProjectMemberResponse response =
                projectMemberService.rejectInvitation(
                        projectId,
                        currentUser.getId()
                );

        return GlobalResponse.success(
                "Project invitation rejected successfully",
                response
        );
    }

    @PatchMapping("/{projectId}/members/{userId}/role")
    public GlobalResponse<ProjectMemberResponse> updateMemberRole(
            @PathVariable UUID projectId,
            @PathVariable UUID userId,
            @Valid @RequestBody ProjectMemberRequest request,
            @AuthenticationPrincipal User currentUser
    ) {

        ProjectMemberResponse response =
                projectMemberService.updateMemberRole(
                        projectId,
                        currentUser.getId(),
                        userId,
                        request
                );

        return GlobalResponse.success(
                "Project member role updated successfully",
                response
        );
    }

    @DeleteMapping("/{projectId}/members/{userId}")
    public GlobalResponse<Void> removeMember(
            @PathVariable UUID projectId,
            @PathVariable UUID userId,
            @AuthenticationPrincipal User currentUser
    ) {

        projectMemberService.removeMember(
                projectId,
                currentUser.getId(),
                userId
        );

        return GlobalResponse.success(
                "Project member removed successfully",
                null
        );
    }
}

