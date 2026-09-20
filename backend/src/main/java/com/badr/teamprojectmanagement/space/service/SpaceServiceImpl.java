
package com.badr.teamprojectmanagement.space.service;

import com.badr.teamprojectmanagement.common.enums.*;
import com.badr.teamprojectmanagement.exception.BadRequestException;
import com.badr.teamprojectmanagement.exception.ForbiddenException;
import com.badr.teamprojectmanagement.exception.ResourceNotFoundException;
import com.badr.teamprojectmanagement.notification.service.NotificationService;
import com.badr.teamprojectmanagement.space.Space;
import com.badr.teamprojectmanagement.space.SpaceJoinRequest;
import com.badr.teamprojectmanagement.space.SpaceJoinRequestRepository;
import com.badr.teamprojectmanagement.space.SpaceMember;
import com.badr.teamprojectmanagement.space.SpaceMemberRepository;
import com.badr.teamprojectmanagement.space.SpaceRepository;
import com.badr.teamprojectmanagement.space.dtos.PublicSpaceResponse;
import com.badr.teamprojectmanagement.space.dtos.SpaceCreateRequest;
import com.badr.teamprojectmanagement.space.dtos.SpaceJoinRequestResponse;
import com.badr.teamprojectmanagement.space.dtos.SpaceResponse;
import com.badr.teamprojectmanagement.space.dtos.SpaceUpdateRequest;
import com.badr.teamprojectmanagement.space.service.SpaceService;
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

    private final NotificationService notificationService;
    private final SpaceRepository spaceRepository;
    private final UserRepository userRepository;
    private final SpaceJoinRequestRepository spaceJoinRequestRepository;
    private final SpaceMemberRepository spaceMemberRepository;

    @Override
    public SpaceResponse createSpace(
            UUID ownerId,
            SpaceCreateRequest request
    ) {

        User owner = userRepository.findById(ownerId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found")
                );

        Space space = Space.builder()
                .name(request.name())
                .description(request.description())
                .visibility(request.visibility())
                .owner(owner)
                .build();

        spaceRepository.save(space);

        /*
         * The owner is also a member of the space.
         */
        SpaceMember ownerMembership = SpaceMember.builder()
                .space(space)
                .user(owner)
                .role(SpaceMemberRole.OWNER)
                .build();

        spaceMemberRepository.save(ownerMembership);

        return mapToResponse(space);
    }

    @Override
    @Transactional(readOnly = true)
    public SpaceResponse getSpaceById(
            UUID id,
            UUID userId
    ) {

        Space space = spaceRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Space not found")
                );

        /*
         * Public spaces can be viewed by everyone.
         */
        if (space.getVisibility() == Visibility.PUBLIC) {
            return mapToResponse(space);
        }

        /*
         * User must be authenticated to access
         * a private space.
         */
        if (userId == null) {
            throw new ForbiddenException(
                    "You do not have access to this space"
            );
        }

        User currentUser = userRepository.findById(userId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Current user not found"
                        )
                );

        /*
         * ADMIN can access any space.
         */
        if (currentUser.getRole() == UserRole.ADMIN) {
            return mapToResponse(space);
        }

        /*
         * Owner can access their own space.
         */
        if (space.getOwner().getId().equals(userId)) {
            return mapToResponse(space);
        }

        /*
         * Check whether the user is an accepted member.
         */
        boolean isMember =
                spaceMemberRepository.existsBySpaceIdAndUserId(
                        id,
                        userId
                );

        if (!isMember) {
            throw new ForbiddenException(
                    "You do not have access to this space"
            );
        }

        return mapToResponse(space);
    }

    @Override
    @Transactional(readOnly = true)
    public List<SpaceResponse> getSpacesByOwner(
            UUID ownerId
    ) {

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
    @Transactional(readOnly = true)
    public List<PublicSpaceResponse> getPublicSpaces(
            UUID userId
    ) {

        return spaceRepository
                .findByVisibility(Visibility.PUBLIC)
                .stream()
                .map(space -> {

                    RequestStatus requestStatus = null;

                    /*
                     * Owner is already accepted.
                     */
                    if (space.getOwner().getId().equals(userId)) {

                        requestStatus = RequestStatus.ACCEPTED;
                    }

                    /*
                     * User is already a member.
                     */
                    else if (spaceMemberRepository
                            .existsBySpaceIdAndUserId(
                                    space.getId(),
                                    userId
                            )) {

                        requestStatus = RequestStatus.ACCEPTED;
                    }

                    /*
                     * Check for an existing join request.
                     */
                    else {

                        requestStatus =
                                spaceJoinRequestRepository
                                        .findBySpaceIdAndUserId(
                                                space.getId(),
                                                userId
                                        )
                                        .map(SpaceJoinRequest::getStatus)
                                        .orElse(null);
                    }

                    return mapToPublicResponse(
                            space,
                            requestStatus
                    );
                })
                .toList();
    }

    @Override
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

        /*
         * Only public spaces can be joined
         * through public discovery.
         */
        if (space.getVisibility() != Visibility.PUBLIC) {

            throw new ForbiddenException(
                    "This space is private"
            );
        }

        /*
         * Owner is already a member.
         */
        if (space.getOwner().getId().equals(userId)) {

            throw new BadRequestException(
                    "You are already the owner of this space"
            );
        }

        /*
         * User is already a member.
         */
        if (spaceMemberRepository
                .existsBySpaceIdAndUserId(
                        spaceId,
                        userId
                )) {

            throw new BadRequestException(
                    "You are already a member of this space"
            );
        }

        /*
         * Check for an existing join request.
         */
        var existingRequest =
                spaceJoinRequestRepository
                        .findBySpaceIdAndUserId(
                                spaceId,
                                userId
                        );

        if (existingRequest.isPresent()) {

            SpaceJoinRequest request =
                    existingRequest.get();

            /*
             * Cannot send another pending request.
             */
            if (request.getStatus() == RequestStatus.PENDING) {

                throw new BadRequestException(
                        "You already have a pending join request"
                );
            }

            /*
             * Allow requesting again after rejection.
             */
            if (request.getStatus() == RequestStatus.REJECTED) {

                request.setStatus(RequestStatus.PENDING);

                spaceJoinRequestRepository.save(request);

                notificationService.createNotification(
                        space.getOwner().getId(),
                        NotificationType.SPACE_JOIN_REQUEST,
                        user.getFirstName() + " " + user.getLastName()
                                + " requested to join your space: "
                                + space.getName()
                );

                return mapToPublicResponse(
                        space,
                        RequestStatus.PENDING
                );
            }

            /*
             * Accepted request means the user has already joined.
             */
            if (request.getStatus() == RequestStatus.ACCEPTED) {

                throw new BadRequestException(
                        "You already joined this space"
                );
            }
        }

        /*
         * Create a new join request.
         */
        SpaceJoinRequest request =
                SpaceJoinRequest.builder()
                        .space(space)
                        .user(user)
                        .status(RequestStatus.PENDING)
                        .build();

        spaceJoinRequestRepository.save(request);

        /*
         * Notify the space owner.
         */
        notificationService.createNotification(
                space.getOwner().getId(),
                NotificationType.SPACE_JOIN_REQUEST,
                user.getFirstName() + " " + user.getLastName()
                        + " requested to join your space: "
                        + space.getName()
        );

        return mapToPublicResponse(
                space,
                RequestStatus.PENDING
        );
    }

    @Override
    @Transactional(readOnly = true)
    public List<SpaceJoinRequestResponse> getPendingJoinRequests(
            UUID spaceId,
            UUID currentUserId
    ) {

        Space space = spaceRepository.findById(spaceId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Space not found")
                );

        /*
         * Only ADMIN or Space OWNER can see requests.
         */
        checkManagementPermission(
                space,
                currentUserId
        );

        return spaceJoinRequestRepository
                .findBySpaceIdAndStatus(
                        spaceId,
                        RequestStatus.PENDING
                )
                .stream()
                .map(this::mapToJoinRequestResponse)
                .toList();
    }

    @Override
    public void acceptJoinRequest(
            UUID spaceId,
            UUID requestId,
            UUID currentUserId
    ) {

        Space space = spaceRepository.findById(spaceId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Space not found")
                );

        /*
         * Only ADMIN or Space OWNER can accept.
         */
        checkManagementPermission(
                space,
                currentUserId
        );

        SpaceJoinRequest request =
                spaceJoinRequestRepository.findById(requestId)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Join request not found"
                                )
                        );

        /*
         * Make sure the request belongs to this space.
         */
        if (!request.getSpace().getId().equals(spaceId)) {

            throw new BadRequestException(
                    "Join request does not belong to this space"
            );
        }

        /*
         * Only pending requests can be accepted.
         */
        if (request.getStatus() != RequestStatus.PENDING) {

            throw new BadRequestException(
                    "This join request is no longer pending"
            );
        }

        /*
         * Create membership.
         */
        boolean alreadyMember =
                spaceMemberRepository.existsBySpaceIdAndUserId(
                        spaceId,
                        request.getUser().getId()
                );

        if (!alreadyMember) {

            SpaceMember member = SpaceMember.builder()
                    .space(space)
                    .user(request.getUser())
                    .role(SpaceMemberRole.MEMBER)
                    .build();

            spaceMemberRepository.save(member);
        }

        /*
         * Mark request as accepted.
         */
        request.setStatus(RequestStatus.ACCEPTED);

        spaceJoinRequestRepository.save(request);

        /*
         * Notify the user.
         */
        notificationService.createNotification(
                request.getUser().getId(),
                NotificationType.SPACE_JOIN_REQUEST_ACCEPTED,
                "Your request to join the space: "
                        + space.getName()
                        + " was accepted."
        );
    }

    @Override
    public void rejectJoinRequest(
            UUID spaceId,
            UUID requestId,
            UUID currentUserId
    ) {

        Space space = spaceRepository.findById(spaceId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Space not found")
                );

        /*
         * Only ADMIN or Space OWNER can reject.
         */
        checkManagementPermission(
                space,
                currentUserId
        );

        SpaceJoinRequest request =
                spaceJoinRequestRepository.findById(requestId)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Join request not found"
                                )
                        );

        /*
         * Make sure the request belongs to this space.
         */
        if (!request.getSpace().getId().equals(spaceId)) {

            throw new BadRequestException(
                    "Join request does not belong to this space"
            );
        }

        /*
         * Only pending requests can be rejected.
         */
        if (request.getStatus() != RequestStatus.PENDING) {

            throw new BadRequestException(
                    "This join request is no longer pending"
            );
        }

        /*
         * Mark request as rejected.
         */
        request.setStatus(RequestStatus.REJECTED);

        spaceJoinRequestRepository.save(request);

        /*
         * Notify the user.
         */
        notificationService.createNotification(
                request.getUser().getId(),
                NotificationType.SPACE_JOIN_REQUEST_REJECTED,
                "Your request to join the space: "
                        + space.getName()
                        + " was rejected."
        );
    }

    @Override
    public SpaceResponse updateSpace(
            UUID id,
            UUID currentUserId,
            SpaceUpdateRequest request
    ) {

        Space space = spaceRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Space not found")
                );

        checkManagementPermission(
                space,
                currentUserId
        );

        space.setName(request.name());
        space.setDescription(request.description());

        spaceRepository.save(space);

        return mapToResponse(space);
    }

    @Override
    public void deleteSpace(
            UUID id,
            UUID currentUserId
    ) {

        Space space = spaceRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Space not found")
                );

        checkManagementPermission(
                space,
                currentUserId
        );

        spaceRepository.delete(space);
    }

    private void checkManagementPermission(
            Space space,
            UUID currentUserId
    ) {

        User currentUser = userRepository.findById(currentUserId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Current user not found"
                        )
                );

        /*
         * ADMIN can manage any space.
         */
        if (currentUser.getRole() == UserRole.ADMIN) {
            return;
        }

        /*
         * Only the Space OWNER can manage the space.
         */
        if (!space.getOwner().getId().equals(currentUserId)) {

            throw new ForbiddenException(
                    "Only the space owner can manage this space"
            );
        }
    }

    private SpaceJoinRequestResponse mapToJoinRequestResponse(
            SpaceJoinRequest request
    ) {

        User user = request.getUser();

        return new SpaceJoinRequestResponse(
                request.getId(),
                request.getSpace().getId(),
                user.getId(),
                user.getFirstName(),
                user.getLastName(),
                user.getEmail(),
                request.getStatus()
        );
    }

    private SpaceResponse mapToResponse(
            Space space
    ) {

        return new SpaceResponse(
                space.getId(),
                space.getName(),
                space.getDescription(),
                space.getVisibility(),
                space.getOwner().getId()
        );
    }

    private PublicSpaceResponse mapToPublicResponse(
            Space space,
            RequestStatus requestStatus
    ) {

        return new PublicSpaceResponse(
                space.getId(),
                space.getName(),
                space.getDescription(),
                space.getVisibility(),
                space.getOwner().getId(),
                requestStatus
        );
    }
}
