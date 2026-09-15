package com.badr.teamprojectmanagement.space.controller;

import com.badr.teamprojectmanagement.common.response.GlobalResponse;
import com.badr.teamprojectmanagement.space.dtos.SpaceCreateRequest;
import com.badr.teamprojectmanagement.space.dtos.SpaceResponse;
import com.badr.teamprojectmanagement.space.dtos.SpaceUpdateRequest;
import com.badr.teamprojectmanagement.space.service.SpaceService;
import com.badr.teamprojectmanagement.user.User;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/spaces")
@RequiredArgsConstructor
public class SpaceController {

    private final SpaceService spaceService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public GlobalResponse<SpaceResponse> createSpace(
            @RequestBody SpaceCreateRequest request,
            @AuthenticationPrincipal User user
    ) {
        SpaceResponse response =
                spaceService.createSpace(
                        user.getId(),
                        request
                );

        return GlobalResponse.success(
                "Space created successfully",
                response
        );
    }

    @GetMapping("/{id}")
    public GlobalResponse<SpaceResponse> getSpaceById(
            @PathVariable UUID id
    ) {
        SpaceResponse response =
                spaceService.getSpaceById(id);

        return GlobalResponse.success(
                "Space retrieved successfully",
                response
        );
    }

    @GetMapping("/my")
    public GlobalResponse<List<SpaceResponse>> getMySpaces(
            @AuthenticationPrincipal User user
    ) {
        List<SpaceResponse> response =
                spaceService.getSpacesByOwner(
                        user.getId()
                );

        return GlobalResponse.success(
                "Spaces retrieved successfully",
                response
        );
    }

    @PutMapping("/{id}")
    public GlobalResponse<SpaceResponse> updateSpace(
            @PathVariable UUID id,
            @RequestBody SpaceUpdateRequest request,
            @AuthenticationPrincipal User user
    ) {
        SpaceResponse response =
                spaceService.updateSpace(
                        id,
                        user.getId(),
                        request
                );

        return GlobalResponse.success(
                "Space updated successfully",
                response
        );
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public GlobalResponse<Void> deleteSpace(
            @PathVariable UUID id,
            @AuthenticationPrincipal User user
    ) {
        spaceService.deleteSpace(
                id,
                user.getId()
        );

        return GlobalResponse.success(
                "Space deleted successfully",
                null
        );
    }
}