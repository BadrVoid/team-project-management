package com.badr.teamprojectmanagement.user.profile.controller;

import com.badr.teamprojectmanagement.common.response.GlobalResponse;
import com.badr.teamprojectmanagement.user.User;
import com.badr.teamprojectmanagement.user.profile.dtos.UserProfileRequest;
import com.badr.teamprojectmanagement.user.profile.dtos.UserProfileResponse;
import com.badr.teamprojectmanagement.user.profile.service.UserProfileService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/profiles")
@RequiredArgsConstructor
public class UserProfileController {

    private final UserProfileService profileService;

    @GetMapping("/me")
    public GlobalResponse<UserProfileResponse> getMyProfile(
            @AuthenticationPrincipal User user
    ) {

        return GlobalResponse.success(
                "Profile retrieved successfully",
                profileService.getMyProfile(user.getId())
        );
    }

    @PutMapping("/me")
    public GlobalResponse<UserProfileResponse> updateMyProfile(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody UserProfileRequest request
    ) {

        return GlobalResponse.success(
                "Profile updated successfully",
                profileService.createOrUpdateProfile(
                        user.getId(),
                        request
                )
        );
    }

    @GetMapping("/{userId}")
    public GlobalResponse<UserProfileResponse> getProfile(
            @PathVariable UUID userId
    ) {

        return GlobalResponse.success(
                "Profile retrieved successfully",
                profileService.getProfile(userId)
        );
    }
}