package com.badr.teamprojectmanagement.user.profile.service;

import com.badr.teamprojectmanagement.exception.ResourceNotFoundException;
import com.badr.teamprojectmanagement.user.User;
import com.badr.teamprojectmanagement.user.UserRepository;
import com.badr.teamprojectmanagement.user.profile.UserProfile;
import com.badr.teamprojectmanagement.user.profile.UserProfileRepository;
import com.badr.teamprojectmanagement.user.profile.dtos.UserProfileRequest;
import com.badr.teamprojectmanagement.user.profile.dtos.UserProfileResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class UserProfileServiceImpl
        implements UserProfileService {

    private final UserRepository userRepository;
    private final UserProfileRepository profileRepository;

    @Override
    @Transactional(readOnly = true)
    public UserProfileResponse getMyProfile(UUID userId) {

        return getProfile(userId);
    }

    @Override
    @Transactional(readOnly = true)
    public UserProfileResponse getProfile(UUID userId) {

        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "User not found"
                        )
                );

        UserProfile profile =
                profileRepository.findByUserId(userId)
                        .orElseGet(() ->
                                UserProfile.builder()
                                        .user(user)
                                        .build()
                        );

        return mapToResponse(user, profile);
    }

    @Override
    public UserProfileResponse createOrUpdateProfile(
            UUID userId,
            UserProfileRequest request
    ) {

        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "User not found"
                        )
                );

        UserProfile profile =
                profileRepository.findByUserId(userId)
                        .orElseGet(() ->
                                UserProfile.builder()
                                        .user(user)
                                        .build()
                        );

        profile.setBio(request.bio());
        profile.setUniversity(request.university());
        profile.setDepartment(request.department());
        profile.setAvatarUrl(request.avatarUrl());

        profile.getSkills().clear();

        if (request.skills() != null) {
            profile.getSkills().addAll(
                    normalize(request.skills())
            );
        }

        profile.getTags().clear();

        if (request.tags() != null) {
            profile.getTags().addAll(
                    normalize(request.tags())
            );
        }

        profileRepository.save(profile);

        return mapToResponse(user, profile);
    }

    private UserProfileResponse mapToResponse(
            User user,
            UserProfile profile
    ) {

        return new UserProfileResponse(
                user.getId(),
                user.getFirstName(),
                user.getLastName(),
                user.getEmail(),
                user.getRole(),
                profile.getBio(),
                profile.getUniversity(),
                profile.getDepartment(),
                profile.getAvatarUrl(),
                List.copyOf(profile.getSkills()),
                List.copyOf(profile.getTags())
        );
    }

    private java.util.List<String> normalize(
            java.util.List<String> values
    ) {

        return values.stream()
                .filter(value ->
                        value != null && !value.isBlank()
                )
                .map(String::trim)
                .distinct()
                .toList();
    }
}