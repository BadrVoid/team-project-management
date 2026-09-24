package com.badr.teamprojectmanagement.user.profile.service;

import com.badr.teamprojectmanagement.auth.AuthProvider;
import com.badr.teamprojectmanagement.auth.UserAuthentication;
import com.badr.teamprojectmanagement.auth.UserAuthenticationRepository;
import com.badr.teamprojectmanagement.exception.BadRequestException;
import com.badr.teamprojectmanagement.exception.ResourceNotFoundException;
import com.badr.teamprojectmanagement.user.User;
import com.badr.teamprojectmanagement.user.UserRepository;
import com.badr.teamprojectmanagement.user.profile.UserProfile;
import com.badr.teamprojectmanagement.user.profile.UserProfileRepository;
import com.badr.teamprojectmanagement.user.profile.dtos.UserProfileRequest;
import com.badr.teamprojectmanagement.user.profile.dtos.UserProfileResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class UserProfileServiceImpl
        implements UserProfileService {

    private final UserAuthenticationRepository userAuthenticationRepository;
    private final UserRepository userRepository;
    private final UserProfileRepository profileRepository;

    @Value("${app.upload.dir:uploads/avatars}")
    private String uploadDir;

    @Value("${app.base-url:http://localhost:8080}")
    private String baseUrl;

    private static final List<String> ALLOWED_CONTENT_TYPES = List.of(
            "image/jpeg",
            "image/jpg",
            "image/png",
            "image/webp",
            "image/gif"
    );

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

    @Override
    public String uploadAvatar(UUID userId, MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new BadRequestException("Uploaded file cannot be empty");
        }

        String contentType = file.getContentType();
        if (contentType == null || !ALLOWED_CONTENT_TYPES.contains(contentType.toLowerCase())) {
            throw new BadRequestException("Invalid file type. Allowed formats: JPEG, PNG, WEBP, GIF");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        UserProfile profile = profileRepository.findByUserId(userId)
                .orElseGet(() -> UserProfile.builder().user(user).build());

        try {
            Path targetFolder = Paths.get(uploadDir).toAbsolutePath().normalize();
            Files.createDirectories(targetFolder);

            String originalFilename = file.getOriginalFilename();
            String extension = ".jpg";
            if (originalFilename != null && originalFilename.contains(".")) {
                extension = originalFilename.substring(originalFilename.lastIndexOf("."));
            }

            String fileName = UUID.randomUUID() + extension;
            Path targetPath = targetFolder.resolve(fileName);

            Files.copy(file.getInputStream(), targetPath, StandardCopyOption.REPLACE_EXISTING);

            String avatarUrl = baseUrl + "/uploads/avatars/" + fileName;

            profile.setAvatarUrl(avatarUrl);
            profileRepository.save(profile);

            return avatarUrl;
        } catch (IOException ex) {
            throw new RuntimeException("Failed to store uploaded avatar file", ex);
        }
    }

    private UserProfileResponse mapToResponse(
            User user,
            UserProfile profile
    ) {

        AuthProvider authProvider =
                userAuthenticationRepository
                        .findByUserId(user.getId())
                        .stream()
                        .findFirst()
                        .map(UserAuthentication::getProvider)
                        .orElse(null);

        return new UserProfileResponse(
                user.getId(),
                user.getFirstName(),
                user.getLastName(),
                user.getEmail(),
                user.getRole(),
                authProvider,
                profile.getBio(),
                profile.getUniversity(),
                profile.getDepartment(),
                profile.getAvatarUrl(),
                List.copyOf(profile.getSkills()),
                List.copyOf(profile.getTags())
        );
    }

    private List<String> normalize(
            List<String> values
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