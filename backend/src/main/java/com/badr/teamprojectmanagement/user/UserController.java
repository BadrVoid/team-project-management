package com.badr.teamprojectmanagement.user;

import com.badr.teamprojectmanagement.common.enums.UserRole;
import com.badr.teamprojectmanagement.common.response.GlobalResponse;
import com.badr.teamprojectmanagement.user.dtos.UserDiscoveryResponse;
import com.badr.teamprojectmanagement.user.dtos.UserResponse;
import com.badr.teamprojectmanagement.user.dtos.UserUpdateRequest;
import com.badr.teamprojectmanagement.user.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    // =========================
    // Admin
    // =========================

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping
    public GlobalResponse<Page<UserResponse>> getUsers(

            @RequestParam(required = false)
            String keyword,

            @RequestParam(required = false)
            UserRole role,

            @RequestParam(required = false)
            Boolean verified,

            @RequestParam(required = false)
            Boolean banned,

            @RequestParam(defaultValue = "0")
            int page,

            @RequestParam(defaultValue = "10")
            int size,

            @RequestParam(defaultValue = "createdAt")
            String sortBy,

            @RequestParam(defaultValue = "desc")
            String direction
    ) {

        Sort sort = direction.equalsIgnoreCase("asc")
                ? Sort.by(sortBy).ascending()
                : Sort.by(sortBy).descending();

        Pageable pageable =
                PageRequest.of(page, size, sort);

        Page<UserResponse> response =
                userService.getUsers(
                        keyword,
                        role,
                        verified,
                        banned,
                        pageable
                );

        return GlobalResponse.success(
                "Users retrieved successfully",
                response
        );
    }

    @GetMapping("/discover")
    public GlobalResponse<Page<UserDiscoveryResponse>> discoverUsers(

            @RequestParam(required = false)
            String keyword,

            @RequestParam(required = false)
            String skill,

            @RequestParam(required = false)
            String tag,

            @RequestParam(defaultValue = "0")
            int page,

            @RequestParam(defaultValue = "10")
            int size
    ) {

        Pageable pageable =
                PageRequest.of(
                        page,
                        size,
                        Sort.by("firstName").ascending()
                );

        return GlobalResponse.success(
                "Users discovered successfully",
                userService.discoverUsers(
                        keyword,
                        skill,
                        tag,
                        pageable
                )
        );
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/{id}")
    public GlobalResponse<UserResponse> getUserById(
            @PathVariable UUID id
    ) {

        return GlobalResponse.success(
                "User retrieved successfully",
                userService.getUserById(id)
        );
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/email")
    public GlobalResponse<UserResponse> getUserByEmail(
            @RequestParam String email
    ) {

        return GlobalResponse.success(
                "User retrieved successfully",
                userService.getUserByEmail(email)
        );
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PatchMapping("/{id}/role")
    public GlobalResponse<Void> updateUserRole(
            @PathVariable UUID id,
            @RequestParam UserRole role
    ) {

        userService.updateUserRole(id, role);

        return GlobalResponse.success(
                "User role updated successfully",
                null
        );
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PatchMapping("/{id}/ban")
    public GlobalResponse<Void> updateUserBanStatus(
            @PathVariable UUID id,
            @RequestParam boolean banned
    ) {

        userService.updateUserBanStatus(id, banned);

        return GlobalResponse.success(
                banned
                        ? "User banned successfully"
                        : "User unbanned successfully",
                null
        );
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public GlobalResponse<Void> deleteUser(
            @PathVariable UUID id
    ) {

        userService.deleteUser(id);

        return GlobalResponse.success(
                "User deleted successfully",
                null
        );
    }

    // =========================
    // Current User
    // =========================

    @GetMapping("/me")
    public GlobalResponse<UserResponse> getCurrentUser(
            @AuthenticationPrincipal User user
    ) {

        return GlobalResponse.success(
                "User retrieved successfully",
                userService.getUserById(user.getId())
        );
    }

    @PutMapping("/me")
    public GlobalResponse<UserResponse> updateCurrentUser(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody UserUpdateRequest request
    ) {

        return GlobalResponse.success(
                "User updated successfully",
                userService.updateUser(
                        user.getId(),
                        request
                )
        );
    }

    @DeleteMapping("/me")
    public GlobalResponse<Void> deleteCurrentUser(
            @AuthenticationPrincipal User user
    ) {

        userService.deleteUser(user.getId());

        return GlobalResponse.success(
                "Account deleted successfully",
                null
        );
    }
}