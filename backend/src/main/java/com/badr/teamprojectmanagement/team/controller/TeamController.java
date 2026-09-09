package com.badr.teamprojectmanagement.team.controller;

import com.badr.teamprojectmanagement.common.response.GlobalResponse;
import com.badr.teamprojectmanagement.team.dtos.TeamCreateRequest;
import com.badr.teamprojectmanagement.team.dtos.TeamResponse;
import com.badr.teamprojectmanagement.team.dtos.TeamUpdateRequest;
import com.badr.teamprojectmanagement.team.service.TeamService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/teams")
@RequiredArgsConstructor
public class TeamController {

    private final TeamService teamService;

    @PostMapping
    public ResponseEntity<GlobalResponse<TeamResponse>> createTeam(
            @Valid @RequestBody TeamCreateRequest request
    ) {

        TeamResponse response =
                teamService.createTeam(request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(
                        GlobalResponse.success(
                                "Team created successfully",
                                response
                        )
                );
    }

    @GetMapping("/{id}")
    public ResponseEntity<GlobalResponse<TeamResponse>> getTeamById(
            @PathVariable UUID id
    ) {

        TeamResponse response =
                teamService.getTeamById(id);

        return ResponseEntity.ok(
                GlobalResponse.success(
                        "Team retrieved successfully",
                        response
                )
        );
    }

    @GetMapping("/project/{projectId}")
    public ResponseEntity<GlobalResponse<List<TeamResponse>>> getTeamsByProject(
            @PathVariable UUID projectId
    ) {

        List<TeamResponse> response =
                teamService.getTeamsByProject(projectId);

        return ResponseEntity.ok(
                GlobalResponse.success(
                        "Teams retrieved successfully",
                        response
                )
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<GlobalResponse<TeamResponse>> updateTeam(
            @PathVariable UUID id,
            @Valid @RequestBody TeamUpdateRequest request
    ) {

        TeamResponse response =
                teamService.updateTeam(
                        id,
                        request
                );

        return ResponseEntity.ok(
                GlobalResponse.success(
                        "Team updated successfully",
                        response
                )
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<GlobalResponse<Void>> deleteTeam(
            @PathVariable UUID id
    ) {

        teamService.deleteTeam(id);

        return ResponseEntity.ok(
                GlobalResponse.success(
                        "Team deleted successfully",
                        null
                )
        );
    }
}