package com.badr.teamprojectmanagement.user.service;

import com.badr.teamprojectmanagement.common.enums.UserRole;
import com.badr.teamprojectmanagement.exception.ResourceNotFoundException;
import com.badr.teamprojectmanagement.user.User;
import com.badr.teamprojectmanagement.user.UserMapper;
import com.badr.teamprojectmanagement.user.UserRepository;
import com.badr.teamprojectmanagement.user.UserSpecification;
import com.badr.teamprojectmanagement.user.dtos.UserDiscoveryResponse;
import com.badr.teamprojectmanagement.user.dtos.UserResponse;
import com.badr.teamprojectmanagement.user.dtos.UserUpdateRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;

    @Override
    @Transactional(readOnly = true)
    public Page<UserResponse> getUsers(
            String keyword,
            UserRole role,
            Boolean verified,
            Boolean banned,
            Pageable pageable
    ) {

        Specification<User> specification =
                Specification.where(
                                UserSpecification.keyword(keyword)
                        )
                        .and(UserSpecification.hasRole(role))
                        .and(UserSpecification.isVerified(verified))
                        .and(UserSpecification.isBanned(banned));

        return userRepository
                .findAll(specification, pageable)
                .map(userMapper::toResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<UserDiscoveryResponse> discoverUsers(
            String keyword,
            String skill,
            String tag,
            Pageable pageable
    ) {

        Specification<User> specification =
                Specification.where(
                                UserSpecification.keyword(keyword)
                        )
                        .and(UserSpecification.skill(skill))
                        .and(UserSpecification.tag(tag));

        return userRepository
                .findAll(specification, pageable)
                .map(userMapper::toDiscoveryResponse);
    }

    @Override
    public void updateUserBanStatus(UUID userId, boolean banned) {

        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found")
                );

        user.setBanned(banned);

        userRepository.save(user);
    }

    @Override
    public void updateUserRole(UUID userId, UserRole role) {

        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found")
                );

        user.setRole(role);

        userRepository.save(user);
    }

    @Override
    public void updateUserStatus(UUID userId, boolean enabled) {

        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found")
                );

        user.setVerified(enabled);

        userRepository.save(user);
    }

    @Override
    @Transactional(readOnly = true)
    public UserResponse getUserById(UUID id) {

        User user = userRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found")
                );

        return userMapper.toResponse(user);
    }

    @Override
    @Transactional(readOnly = true)
    public UserResponse getUserByEmail(String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found")
                );

        return userMapper.toResponse(user);
    }

    @Override
    public UserResponse updateUser(
            UUID id,
            UserUpdateRequest request
    ) {

        User user = userRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found")
                );

        user.setFirstName(request.firstName());
        user.setLastName(request.lastName());

        userRepository.save(user);

        return userMapper.toResponse(user);
    }

    @Override
    public void deleteUser(UUID userId) {

        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found")
                );

        userRepository.delete(user);
    }
}