package com.badr.teamprojectmanagement.team.controller;

import com.badr.teamprojectmanagement.common.response.GlobalResponse;
import com.badr.teamprojectmanagement.team.dtos.TeamMemberRequest;
import com.badr.teamprojectmanagement.team.dtos.TeamMemberResponse;
import com.badr.teamprojectmanagement.team.service.TeamMemberService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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
            @Valid @RequestBody TeamMemberRequest request
    ) {

        TeamMemberResponse response =
                teamMemberService.addMember(
                        teamId,
                        request
                );

        return ResponseEntity
                .status(HttpStatus.CREATED)
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
            @Valid @RequestBody TeamMemberRequest request
    ) {

        TeamMemberResponse response =
                teamMemberService.updateMemberRole(
                        teamId,
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
            @PathVariable UUID userId
    ) {

        teamMemberService.removeMember(
                teamId,
                userId
        );

        return ResponseEntity.ok(
                GlobalResponse.success(
                        "Team member removed successfully",
                        null
                )
        );
    }
}