package com.badr.teamprojectmanagement.user.service;

import com.badr.teamprojectmanagement.exception.ResourceNotFoundException;
import com.badr.teamprojectmanagement.user.User;
import com.badr.teamprojectmanagement.user.UserRepository;
import com.badr.teamprojectmanagement.user.dtos.UserResponse;
import com.badr.teamprojectmanagement.user.dtos.UserUpdateRequest;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;

    @Override
    @Transactional(readOnly = true)
    public UserResponse getUserById(UUID id) {

        //Find user by id
        User user = userRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found")
                );

        return mapToResponse(user);
    }

    @Override
    @Transactional(readOnly = true)
    public UserResponse getUserByEmail(String email) {

        //Find user by email
        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found")
                );

        return mapToResponse(user);
    }

    @Override
    public UserResponse updateUser(UUID id, UserUpdateRequest request) {

        //Find user by id
        User user = userRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found")
                );

        //Update user information
        user.setFirstName(request.firstName());
        user.setLastName(request.lastName());

        //Save updated user
        userRepository.save(user);

        return mapToResponse(user);
    }

    @Override
    public void deleteUser(UUID id) {

        //Check if user exists
        if (!userRepository.existsById(id)) {
            throw new ResourceNotFoundException("User not found");
        }

        //Delete user
        userRepository.deleteById(id);
    }

    private UserResponse mapToResponse(User user) {

        return new UserResponse(
                user.getId(),
                user.getFirstName(),
                user.getLastName(),
                user.getEmail(),
                user.getRole(),
                user.isVerified()
        );
    }
}