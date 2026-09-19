package com.badr.teamprojectmanagement.space.service;

import com.badr.teamprojectmanagement.common.enums.SpaceRequestStatus;
import com.badr.teamprojectmanagement.common.enums.SpaceMemberRole;
import com.badr.teamprojectmanagement.common.enums.SpaceRequestStatus;
import com.badr.teamprojectmanagement.common.enums.Visibility;
import com.badr.teamprojectmanagement.exception.BadRequestException;
import com.badr.teamprojectmanagement.exception.ForbiddenException;
import com.badr.teamprojectmanagement.exception.ResourceNotFoundException;
import com.badr.teamprojectmanagement.space.*;
import com.badr.teamprojectmanagement.space.dtos.PublicSpaceResponse;
import com.badr.teamprojectmanagement.space.dtos.SpaceCreateRequest;
import com.badr.teamprojectmanagement.space.dtos.SpaceResponse;
import com.badr.teamprojectmanagement.space.dtos.SpaceUpdateRequest;
import com.badr.teamprojectmanagement.user.User;
import com.badr.teamprojectmanagement.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class SpaceServiceImpl implements SpaceService {

    private final SpaceRepository spaceRepository;
    private final UserRepository userRepository;
    private final SpaceMemberRepository spaceMemberRepository;
    private final SpaceJoinRequestRepository spaceJoinRequestRepository;

    @Override
    @Transactional
    public SpaceResponse createSpace(
            UUID ownerId,
            SpaceCreateRequest request
    ) {
        User owner = userRepository.findById(ownerId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found")
                );

        if (spaceRepository.existsByOwnerIdAndNameIgnoreCase(
                ownerId,
                request.name().trim()
        )) {
            throw new BadRequestException(
                    "A space with this name already exists"
            );
        }

        Space space = Space.builder()
                .name(request.name().trim())
                .description(request.description())
                .visibility(
                        request.visibility() != null
                                ? request.visibility()
                                : Visibility.PRIVATE
                )
                .owner(owner)
                .build();

        spaceRepository.save(space);

        SpaceMember ownerMember = SpaceMember.builder()
                .space(space)
                .user(owner)
                .role(SpaceMemberRole.OWNER)
                .build();

        spaceMemberRepository.save(ownerMember);

        return mapToResponse(space);
    }


    @Override
    @Transactional(readOnly = true)
    public SpaceResponse getSpaceById(UUID id, UUID userId) {
        Space space = spaceRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Space not found")
                );

        boolean isPublic = space.getVisibility() == Visibility.PUBLIC;

        boolean isOwner = userId != null
                && space.getOwner().getId().equals(userId);

        if (!isPublic && !isOwner) {
            throw new ForbiddenException(
                    "You are not allowed to access this space"
            );
        }

        return mapToResponse(space);
    }

    @Override
    @Transactional
    public PublicSpaceResponse joinSpace(
            UUID spaceId,
            UUID userId
    ) {
        Space space = spaceRepository.findById(spaceId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Space not found")
                );

        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found")
                );

        if (space.getVisibility() != Visibility.PUBLIC) {
            throw new ForbiddenException(
                    "You cannot join a private space"
            );
        }

        if (spaceMemberRepository.existsBySpaceIdAndUserId(
                spaceId,
                userId
        )) {
            throw new BadRequestException(
                    "You are already a member of this space"
            );
        }

        if (spaceJoinRequestRepository
                .existsBySpaceIdAndUserIdAndStatus(
                        spaceId,
                        userId,
                        SpaceRequestStatus.PENDING
                )) {

            throw new BadRequestException(
                    "You already have a pending join request"
            );
        }

        SpaceJoinRequest request = SpaceJoinRequest.builder()
                .space(space)
                .user(user)
                .status(SpaceRequestStatus.PENDING)
                .build();

        spaceJoinRequestRepository.save(request);

        return mapToPublicSpaceResponse(
                space,
                SpaceRequestStatus.PENDING
        );
    }

    @Override
    @Transactional(readOnly = true)
    public List<PublicSpaceResponse> getPublicSpaces(
            UUID userId
    ) {
        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found")
                );

        return spaceRepository
                .findByVisibility(Visibility.PUBLIC)
                .stream()
                .map(space -> {
                    SpaceRequestStatus status =
                            getRequestStatus(
                                    space.getId(),
                                    user.getId()
                            );

                    return mapToPublicSpaceResponse(
                            space,
                            status
                    );
                })
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<SpaceResponse> getSpacesByOwner(UUID ownerId) {

        User owner = userRepository.findById(ownerId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found")
                );

        return spaceRepository.findByOwner(owner)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public SpaceResponse updateSpace(
            UUID id,
            UUID ownerId,
            SpaceUpdateRequest request
    ) {

        Space space = spaceRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Space not found")
                );

        if (!space.getOwner().getId().equals(ownerId)) {
            throw new ForbiddenException(
                    "You are not allowed to update this space"
            );
        }

        space.setName(request.name());
        space.setDescription(request.description());

        spaceRepository.save(space);

        return mapToResponse(space);
    }

    @Override
    public void deleteSpace(UUID id, UUID ownerId) {

        Space space = spaceRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Space not found")
                );

        if (!space.getOwner().getId().equals(ownerId)) {
            throw new ForbiddenException(
                    "You are not allowed to delete this space"
            );
        }

        spaceRepository.delete(space);
    }

    private SpaceResponse mapToResponse(Space space) {

        return new SpaceResponse(
                space.getId(),
                space.getName(),
                space.getDescription(),
                space.getVisibility(),
                space.getOwner().getId()
        );
    }

    private SpaceRequestStatus getRequestStatus(
            UUID spaceId,
            UUID userId
    ) {
        if (spaceMemberRepository.existsBySpaceIdAndUserIdAndRole(
                spaceId,
                userId,
                SpaceMemberRole.OWNER
        )) {
            return SpaceRequestStatus.OWNER;
        }

        if (spaceMemberRepository.existsBySpaceIdAndUserId(
                spaceId,
                userId
        )) {
            return SpaceRequestStatus.MEMBER;
        }

        if (spaceJoinRequestRepository.existsBySpaceIdAndUserIdAndStatus(
                spaceId,
                userId,
                SpaceRequestStatus.PENDING
        )) {
            return SpaceRequestStatus.PENDING;
        }

        return SpaceRequestStatus.NONE;
    }

    private PublicSpaceResponse mapToPublicSpaceResponse(
            Space space,
            SpaceRequestStatus RequestStatus
    ) {
        return new PublicSpaceResponse(
                space.getId(),
                space.getName(),
                space.getDescription(),
                space.getVisibility(),
                space.getOwner().getId(),
                RequestStatus
        );
    }
}
