
package com.badr.teamprojectmanagement.user.service;

import com.badr.teamprojectmanagement.common.enums.UserRole;
import com.badr.teamprojectmanagement.user.dtos.UserDiscoveryResponse;
import com.badr.teamprojectmanagement.user.dtos.UserResponse;
import com.badr.teamprojectmanagement.user.dtos.UserUpdateRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.UUID;

public interface UserService {

    // Admin
    Page<UserResponse> getUsers(
            String keyword,
            UserRole role,
            Boolean verified,
            Boolean banned,
            Pageable pageable
    );

    UserResponse getUserById(UUID id);

    UserResponse getUserByEmail(String email);

    void updateUserRole(UUID userId, UserRole role);

    void updateUserStatus(UUID userId, boolean enabled);

    void deleteUser(UUID userId);

    void updateUserBanStatus(UUID userId, boolean banned);

    Page<UserDiscoveryResponse> discoverUsers(
            String keyword,
            String skill,
            String tag,
            Pageable pageable
    );
    // User
    UserResponse updateUser(UUID id, UserUpdateRequest request);
}

