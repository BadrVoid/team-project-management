package com.badr.teamprojectmanagement.user;

import com.badr.teamprojectmanagement.user.dtos.UserDiscoveryResponse;
import com.badr.teamprojectmanagement.user.dtos.UserResponse;
import com.badr.teamprojectmanagement.user.profile.UserProfile;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class UserMapper {

    public UserResponse toResponse(User user) {
        return new UserResponse(
                user.getId(),
                user.getFirstName(),
                user.getLastName(),
                user.getEmail(),
                user.getRole(),
                user.isVerified(),
                user.isBanned()
        );
    }

    public UserDiscoveryResponse toDiscoveryResponse(User user) {

        UserProfile profile = user.getProfile();

        return new UserDiscoveryResponse(
                user.getId(),
                user.getFirstName(),
                user.getLastName(),
                user.getRole(),
                profile != null ? profile.getBio() : null,
                profile != null ? profile.getAvatarUrl() : null,
                profile != null
                        ? List.copyOf(profile.getSkills())
                        : List.of(),
                profile != null
                        ? List.copyOf(profile.getTags())
                        : List.of()
        );
    }
}