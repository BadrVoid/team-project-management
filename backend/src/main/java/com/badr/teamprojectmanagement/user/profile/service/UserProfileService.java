package com.badr.teamprojectmanagement.user.profile.service;

import com.badr.teamprojectmanagement.user.profile.dtos.UserProfileRequest;
import com.badr.teamprojectmanagement.user.profile.dtos.UserProfileResponse;
import org.springframework.web.multipart.MultipartFile;

import java.util.UUID;

public interface UserProfileService {

    UserProfileResponse getMyProfile(UUID userId);

    UserProfileResponse getProfile(UUID userId);

    UserProfileResponse createOrUpdateProfile(
            UUID userId,
            UserProfileRequest request
    );
    String uploadAvatar(UUID userId, MultipartFile file);
}
