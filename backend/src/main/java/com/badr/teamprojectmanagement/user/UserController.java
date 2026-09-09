package com.badr.teamprojectmanagement.user;

import com.badr.teamprojectmanagement.common.response.GlobalResponse;
import com.badr.teamprojectmanagement.user.dtos.UserResponse;
import com.badr.teamprojectmanagement.user.dtos.UserUpdateRequest;
import com.badr.teamprojectmanagement.user.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/{id}")
    public GlobalResponse<UserResponse> getUserById(
            @PathVariable UUID id
    ) {

        UserResponse response =
                userService.getUserById(id);

        return GlobalResponse.success(
                "User retrieved successfully",
                response
        );
    }

    @GetMapping("/email")
    public GlobalResponse<UserResponse> getUserByEmail(
            @RequestParam String email
    ) {

        UserResponse response =
                userService.getUserByEmail(email);

        return GlobalResponse.success(
                "User retrieved successfully",
                response
        );
    }

    @PutMapping("/{id}")
    public GlobalResponse<UserResponse> updateUser(
            @PathVariable UUID id,
            @Valid @RequestBody UserUpdateRequest request
    ) {

        UserResponse response =
                userService.updateUser(id, request);

        return GlobalResponse.success(
                "User updated successfully",
                response
        );
    }

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
}