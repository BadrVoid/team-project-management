package com.badr.teamprojectmanagement.project.controller;

import com.badr.teamprojectmanagement.common.response.GlobalResponse;
import com.badr.teamprojectmanagement.project.dtos.ProjectMemberRequest;
import com.badr.teamprojectmanagement.project.dtos.ProjectMemberResponse;
import com.badr.teamprojectmanagement.project.service.ProjectMemberService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
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
            @Valid @RequestBody ProjectMemberRequest request
    ) {
        ProjectMemberResponse response =
                projectMemberService.inviteMember(projectId, request);

        return GlobalResponse.success(
                "User invited successfully",
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
            @PathVariable UUID userId
    ) {
        List<ProjectMemberResponse> response =
                projectMemberService.getMyInvitations(userId);

        return GlobalResponse.success(
                "Invitations retrieved successfully",
                response
        );
    }

    @PatchMapping("/{projectId}/members/{userId}/accept")
    public GlobalResponse<ProjectMemberResponse> acceptInvitation(
            @PathVariable UUID projectId,
            @PathVariable UUID userId
    ) {
        ProjectMemberResponse response =
                projectMemberService.acceptInvitation(
                        projectId,
                        userId
                );

        return GlobalResponse.success(
                "Invitation accepted successfully",
                response
        );
    }

    @PatchMapping("/{projectId}/members/{userId}/reject")
    public GlobalResponse<ProjectMemberResponse> rejectInvitation(
            @PathVariable UUID projectId,
            @PathVariable UUID userId
    ) {
        ProjectMemberResponse response =
                projectMemberService.rejectInvitation(
                        projectId,
                        userId
                );

        return GlobalResponse.success(
                "Invitation rejected successfully",
                response
        );
    }

    @PatchMapping("/{projectId}/members/{userId}/role")
    public GlobalResponse<ProjectMemberResponse> updateMemberRole(
            @PathVariable UUID projectId,
            @PathVariable UUID userId,
            @Valid @RequestBody ProjectMemberRequest request
    ) {
        ProjectMemberResponse response =
                projectMemberService.updateMemberRole(
                        projectId,
                        userId,
                        request
                );

        return GlobalResponse.success(
                "Member role updated successfully",
                response
        );
    }

    @DeleteMapping("/{projectId}/members/{userId}")
    public GlobalResponse<Void> removeMember(
            @PathVariable UUID projectId,
            @PathVariable UUID userId
    ) {
        projectMemberService.removeMember(projectId, userId);

        return GlobalResponse.success(
                "Member removed successfully",
                null
        );
    }
}