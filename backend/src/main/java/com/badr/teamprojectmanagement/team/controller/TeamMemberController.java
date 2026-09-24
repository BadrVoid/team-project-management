
package com.badr.teamprojectmanagement.team.controller;

import com.badr.teamprojectmanagement.common.response.GlobalResponse;
import com.badr.teamprojectmanagement.exception.ForbiddenException;
import com.badr.teamprojectmanagement.team.dtos.TeamMemberRequest;
import com.badr.teamprojectmanagement.team.dtos.TeamMemberResponse;
import com.badr.teamprojectmanagement.team.service.TeamMemberService;
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
@RequestMapping("/api/teams/{teamId}/members")
@RequiredArgsConstructor
public class TeamMemberController {

    private final TeamMemberService teamMemberService;

    @PostMapping
    public ResponseEntity<GlobalResponse<TeamMemberResponse>> addMember(
            @PathVariable UUID teamId,
            @Valid @RequestBody TeamMemberRequest request,
            @AuthenticationPrincipal User currentUser
    ) {

        TeamMemberResponse response =
                teamMemberService.addMember(
                        teamId,
                        currentUser.getId(),
                        request
                );

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(
                        GlobalResponse.success(
                                "Team member added successfully",
                                response
                        )
                );
    }

    @GetMapping
    public ResponseEntity<GlobalResponse<List<TeamMemberResponse>>> getTeamMembers(
            @PathVariable UUID teamId
    ) {

        List<TeamMemberResponse> response =
                teamMemberService.getTeamMembers(teamId);

        return ResponseEntity.ok(
                GlobalResponse.success(
                        "Team members retrieved successfully",
                        response
                )
        );
    }

    @PutMapping("/{userId}")
    public ResponseEntity<GlobalResponse<TeamMemberResponse>> updateMemberRole(
            @PathVariable UUID teamId,
            @PathVariable UUID userId,
            @Valid @RequestBody TeamMemberRequest request,
            @AuthenticationPrincipal User currentUser
    ) {

        TeamMemberResponse response =
                teamMemberService.updateMemberRole(
                        teamId,
                        currentUser.getId(),
                        userId,
                        request
                );

        return ResponseEntity.ok(
                GlobalResponse.success(
                        "Team member role updated successfully",
                        response
                )
        );
    }

    @DeleteMapping("/{userId}")
    public ResponseEntity<GlobalResponse<Void>> removeMember(
            @PathVariable UUID teamId,
            @PathVariable UUID userId,
            @AuthenticationPrincipal User currentUser
    ) {

        teamMemberService.removeMember(
                teamId,
                currentUser.getId(),
                userId
        );

        return ResponseEntity.ok(
                GlobalResponse.success(
                        "Team member removed successfully",
                        null
                )
        );
    }

    @PatchMapping("/{userId}/accept")
    public GlobalResponse<TeamMemberResponse> acceptInvitation(
            @PathVariable UUID teamId,
            @PathVariable UUID userId,
            @AuthenticationPrincipal User currentUser
    ) {

        if (!currentUser.getId().equals(userId)) {
            throw new ForbiddenException(
                    "You can only accept your own invitation"
            );
        }

        TeamMemberResponse response =
                teamMemberService.acceptInvitation(
                        teamId,
                        currentUser.getId()
                );

        return GlobalResponse.success(
                "Team invitation accepted successfully",
                response
        );
    }

    @PatchMapping("/{userId}/reject")
    public GlobalResponse<TeamMemberResponse> rejectInvitation(
            @PathVariable UUID teamId,
            @PathVariable UUID userId,
            @AuthenticationPrincipal User currentUser
    ) {

        if (!currentUser.getId().equals(userId)) {
            throw new ForbiddenException(
                    "You can only reject your own invitation"
            );
        }

        TeamMemberResponse response =
                teamMemberService.rejectInvitation(
                        teamId,
                        currentUser.getId()
                );

        return GlobalResponse.success(
                "Team invitation rejected successfully",
                response
        );
    }
}
