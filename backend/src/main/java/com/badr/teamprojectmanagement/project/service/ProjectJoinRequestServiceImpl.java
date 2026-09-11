package com.badr.teamprojectmanagement.project.service;

import com.badr.teamprojectmanagement.common.enums.JoinRequestStatus;
import com.badr.teamprojectmanagement.common.enums.NotificationType;
import com.badr.teamprojectmanagement.common.enums.ProjectMemberRole;
import com.badr.teamprojectmanagement.exception.BadRequestException;
import com.badr.teamprojectmanagement.exception.ResourceNotFoundException;
import com.badr.teamprojectmanagement.notification.service.NotificationService;
import com.badr.teamprojectmanagement.project.Project;
import com.badr.teamprojectmanagement.project.ProjectJoinRequest;
import com.badr.teamprojectmanagement.project.ProjectJoinRequestRepository;
import com.badr.teamprojectmanagement.project.ProjectMember;
import com.badr.teamprojectmanagement.project.ProjectMemberRepository;
import com.badr.teamprojectmanagement.project.ProjectRepository;
import com.badr.teamprojectmanagement.project.dtos.ProjectJoinRequestResponse;
import com.badr.teamprojectmanagement.user.User;
import com.badr.teamprojectmanagement.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class ProjectJoinRequestServiceImpl
        implements ProjectJoinRequestService {

    private final ProjectJoinRequestRepository joinRequestRepository;
    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;
    private final ProjectMemberRepository projectMemberRepository;
    private final NotificationService notificationService;

    // =========================================================
    // JOIN REQUEST FLOW
    // =========================================================

    @Override
    public ProjectJoinRequestResponse sendJoinRequest(
            UUID projectId,
            UUID userId
    ) {

        Project project = findProject(projectId);
        User user = findUser(userId);

        // User cannot request to join a project they already belong to
        if (projectMemberRepository.existsByProjectIdAndUser(
                projectId,
                user
        )) {
            throw new BadRequestException(
                    "User is already a project member"
            );
        }

        // Check existing request
        var existingRequest =
                joinRequestRepository.findByProjectIdAndUser(
                        projectId,
                        user
                );

        if (existingRequest.isPresent()) {

            ProjectJoinRequest request = existingRequest.get();

            // Don't allow duplicate pending requests
            if (request.getStatus() == JoinRequestStatus.PENDING) {
                throw new BadRequestException(
                        "Join request is already pending"
                );
            }

            // Allow requesting again after rejection
            request.setStatus(JoinRequestStatus.PENDING);

            joinRequestRepository.save(request);

            return mapToResponse(request);
        }

        // Create new join request
        ProjectJoinRequest request = ProjectJoinRequest.builder()
                .project(project)
                .user(user)
                .status(JoinRequestStatus.PENDING)
                .build();

        ProjectJoinRequest savedRequest =
                joinRequestRepository.save(request);

        return mapToResponse(savedRequest);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProjectJoinRequestResponse> getProjectJoinRequests(
            UUID projectId,
            UUID currentUserId
    ) {

        // Make sure project exists
        if (!projectRepository.existsById(projectId)) {
            throw new ResourceNotFoundException("Project not found");
        }

        // Only OWNER/MANAGER can view requests
        verifyProjectManager(projectId, currentUserId);

        return joinRequestRepository
                .findByProjectIdAndStatus(
                        projectId,
                        JoinRequestStatus.PENDING
                )
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public ProjectJoinRequestResponse acceptJoinRequest(
            UUID requestId,
            UUID currentUserId
    ) {

        ProjectJoinRequest request = findRequest(requestId);

        UUID projectId = request.getProject().getId();

        // Only OWNER/MANAGER can accept requests
        verifyProjectManager(projectId, currentUserId);

        if (request.getStatus() != JoinRequestStatus.PENDING) {
            throw new BadRequestException(
                    "Join request has already been processed"
            );
        }

        Project project = request.getProject();
        User user = request.getUser();

        // Make sure user is not already a member
        if (projectMemberRepository.existsByProjectIdAndUser(
                projectId,
                user
        )) {
            throw new BadRequestException(
                    "User is already a project member"
            );
        }

        // Create project member
        ProjectMember member = ProjectMember.builder()
                .project(project)
                .user(user)
                .role(ProjectMemberRole.MEMBER)
                .build();

        projectMemberRepository.save(member);

        // Mark request as accepted
        request.setStatus(JoinRequestStatus.ACCEPTED);

        joinRequestRepository.save(request);

        return mapToResponse(request);
    }

    @Override
    public ProjectJoinRequestResponse rejectJoinRequest(
            UUID requestId,
            UUID currentUserId
    ) {

        ProjectJoinRequest request = findRequest(requestId);

        UUID projectId = request.getProject().getId();

        // Only OWNER/MANAGER can reject requests
        verifyProjectManager(projectId, currentUserId);

        if (request.getStatus() != JoinRequestStatus.PENDING) {
            throw new BadRequestException(
                    "Join request has already been processed"
            );
        }

        request.setStatus(JoinRequestStatus.REJECTED);

        joinRequestRepository.save(request);

        return mapToResponse(request);
    }

    // =========================================================
    // INVITATION FLOW
    // =========================================================

    @Override
    public ProjectJoinRequestResponse inviteUser(
            UUID projectId,
            UUID userId,
            UUID currentUserId
    ) {

        // Only OWNER/MANAGER can invite users
        verifyProjectManager(projectId, currentUserId);

        Project project = findProject(projectId);
        User user = findUser(userId);

        // User cannot be invited if already a member
        if (projectMemberRepository.existsByProjectIdAndUser(
                projectId,
                user
        )) {
            throw new BadRequestException(
                    "User is already a project member"
            );
        }

        var existingRequest =
                joinRequestRepository.findByProjectIdAndUser(
                        projectId,
                        user
                );

        ProjectJoinRequest request;

        if (existingRequest.isPresent()) {

            request = existingRequest.get();

            // Don't allow another pending request/invitation
            if (request.getStatus() == JoinRequestStatus.PENDING) {
                throw new BadRequestException(
                        "There is already a pending request or invitation"
                );
            }

            // Reuse rejected request
            request.setStatus(JoinRequestStatus.PENDING);

        } else {

            request = ProjectJoinRequest.builder()
                    .project(project)
                    .user(user)
                    .status(JoinRequestStatus.PENDING)
                    .build();
        }

        ProjectJoinRequest savedRequest =
                joinRequestRepository.save(request);

        // Notify invited user
        notificationService.createNotification(
                user.getId(),
                NotificationType.PROJECT_INVITATION,
                "You have been invited to join project: "
                        + project.getName()
        );

        return mapToResponse(savedRequest);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProjectJoinRequestResponse> getMyInvitations(
            UUID userId
    ) {

        if (!userRepository.existsById(userId)) {
            throw new ResourceNotFoundException("User not found");
        }

        return joinRequestRepository
                .findByUserIdAndStatus(
                        userId,
                        JoinRequestStatus.PENDING
                )
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public ProjectJoinRequestResponse acceptInvitation(
            UUID requestId,
            UUID userId
    ) {

        ProjectJoinRequest request = findRequest(requestId);

        // Only the invited user can accept
        if (!request.getUser().getId().equals(userId)) {
            throw new AccessDeniedException(
                    "This invitation does not belong to you"
            );
        }

        if (request.getStatus() != JoinRequestStatus.PENDING) {
            throw new BadRequestException(
                    "Invitation has already been processed"
            );
        }

        Project project = request.getProject();
        User user = request.getUser();

        // Make sure user is not already a member
        if (projectMemberRepository.existsByProjectIdAndUser(
                project.getId(),
                user
        )) {
            throw new BadRequestException(
                    "User is already a project member"
            );
        }

        // Add user to project
        ProjectMember member = ProjectMember.builder()
                .project(project)
                .user(user)
                .role(ProjectMemberRole.MEMBER)
                .build();

        projectMemberRepository.save(member);

        // Mark invitation as accepted
        request.setStatus(JoinRequestStatus.ACCEPTED);

        joinRequestRepository.save(request);

        return mapToResponse(request);
    }

    @Override
    public ProjectJoinRequestResponse rejectInvitation(
            UUID requestId,
            UUID userId
    ) {

        ProjectJoinRequest request = findRequest(requestId);

        // Only the invited user can reject
        if (!request.getUser().getId().equals(userId)) {
            throw new AccessDeniedException(
                    "This invitation does not belong to you"
            );
        }

        if (request.getStatus() != JoinRequestStatus.PENDING) {
            throw new BadRequestException(
                    "Invitation has already been processed"
            );
        }

        request.setStatus(JoinRequestStatus.REJECTED);

        joinRequestRepository.save(request);

        return mapToResponse(request);
    }

    // =========================================================
    // HELPERS
    // =========================================================

    private Project findProject(UUID projectId) {

        return projectRepository.findById(projectId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Project not found"
                        )
                );
    }

    private User findUser(UUID userId) {

        return userRepository.findById(userId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "User not found"
                        )
                );
    }

    private ProjectJoinRequest findRequest(UUID requestId) {

        return joinRequestRepository.findById(requestId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Join request not found"
                        )
                );
    }

    private void verifyProjectManager(
            UUID projectId,
            UUID userId
    ) {

        boolean canManage = projectMemberRepository
                .findByProjectIdAndUserId(
                        projectId,
                        userId
                )
                .map(member ->
                        member.getRole() == ProjectMemberRole.OWNER
                                || member.getRole() == ProjectMemberRole.MANAGER
                )
                .orElse(false);

        if (!canManage) {
            throw new AccessDeniedException(
                    "You are not allowed to manage this project"
            );
        }
    }

    private ProjectJoinRequestResponse mapToResponse(
            ProjectJoinRequest request
    ) {

        return ProjectJoinRequestResponse.builder()
                .id(request.getId())
                .projectId(request.getProject().getId())
                .userId(request.getUser().getId())
                .status(request.getStatus())
                .build();
    }
}