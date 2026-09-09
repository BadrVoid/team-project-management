package com.badr.teamprojectmanagement.user.service;

import com.badr.teamprojectmanagement.user.dtos.UserResponse;
import com.badr.teamprojectmanagement.user.dtos.UserUpdateRequest;

import java.util.UUID;

public interface UserService {

    UserResponse getUserById(UUID id);

    UserResponse getUserByEmail(String email);

    UserResponse updateUser(UUID id, UserUpdateRequest request);

    void deleteUser(UUID id);
}