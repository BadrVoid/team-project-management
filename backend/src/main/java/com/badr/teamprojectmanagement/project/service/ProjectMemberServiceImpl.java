
package com.badr.teamprojectmanagement.project.service;

import com.badr.teamprojectmanagement.common.enums.NotificationType;
import com.badr.teamprojectmanagement.common.enums.ProjectMemberRole;
import com.badr.teamprojectmanagement.common.enums.RequestStatus;
import com.badr.teamprojectmanagement.common.enums.UserRole;
import com.badr.teamprojectmanagement.exception.BadRequestException;
import com.badr.teamprojectmanagement.exception.ForbiddenException;
import com.badr.teamprojectmanagement.exception.ResourceNotFoundException;
import com.badr.teamprojectmanagement.notification.service.NotificationService;
import com.badr.teamprojectmanagement.project.Project;
import com.badr.teamprojectmanagement.project.ProjectMember;
import com.badr.teamprojectmanagement.project.ProjectMemberRepository;
import com.badr.teamprojectmanagement.project.ProjectRepository;
import com.badr.teamprojectmanagement.project.dtos.ProjectMemberRequest;
import com.badr.teamprojectmanagement.project.dtos.ProjectMemberResponse;
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
public class ProjectMemberServiceImpl implements ProjectMemberService {

    private final ProjectMemberRepository projectMemberRepository;
    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;
    @Override
    public ProjectMemberResponse inviteMember(
            UUID projectId,
            UUID currentUserId,
            ProjectMemberRequest request
    ) {

        Project project = getProject(projectId);

        // ADMIN, OWNER, or MANAGER can invite members
        checkManagementPermission(
                projectId,
                currentUserId
        );

        User user = userRepository.findById(request.userId())
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found")
                );

        // Do not allow an admin to be added as a project member
        if (user.getRole() == UserRole.ADMIN) {
            throw new BadRequestException(
                    "Admins do not need to be project members"
            );
        }

        var existingMember =
                projectMemberRepository.findByProjectIdAndUser(
                        projectId,
                        user
                );

        if (existingMember.isPresent()) {

            ProjectMember member = existingMember.get();

            // Reactivate rejected invitation
            if (member.getStatus() == RequestStatus.REJECTED) {

                member.setStatus(RequestStatus.PENDING);
                member.setRole(request.role());

                notificationService.createNotification(
                        user.getId(),
                        NotificationType.PROJECT_INVITATION,
                        "You have been invited to join the project: "
                                + project.getName(),project.getId()
                );

                return mapToResponse(member);
            }

            throw new BadRequestException(
                    "User already has an active or pending membership"
            );
        }

        ProjectMember member = ProjectMember.builder()
                .project(project)
                .user(user)
                .role(request.role())
                .status(RequestStatus.PENDING)
                .build();

        projectMemberRepository.save(member);

        notificationService.createNotification(
                user.getId(),
                NotificationType.PROJECT_INVITATION,
                "You have been invited to join the project: "
                        + project.getName(),project.getId()
        );

        return mapToResponse(member);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProjectMemberResponse> getProjectMembers(
            UUID projectId
    ) {

        if (!projectRepository.existsById(projectId)) {
            throw new ResourceNotFoundException("Project not found");
        }

        return projectMemberRepository.findByProjectId(projectId)
                .stream()
                .filter(member ->
                        member.getStatus() == RequestStatus.ACCEPTED
                )
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProjectMemberResponse> getMyInvitations(
            UUID userId
    ) {

        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found")
                );

        return projectMemberRepository
                .findByUserAndStatus(
                        user,
                        RequestStatus.PENDING
                )
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public ProjectMemberResponse acceptInvitation(
            UUID projectId,
            UUID currentUserId
    ) {

        ProjectMember member =
                findPendingMembership(
                        projectId,
                        currentUserId
                );

        member.setStatus(RequestStatus.ACCEPTED);

        return mapToResponse(member);
    }

    @Override
    public ProjectMemberResponse rejectInvitation(
            UUID projectId,
            UUID currentUserId
    ) {

        ProjectMember member =
                findPendingMembership(
                        projectId,
                        currentUserId
                );

        member.setStatus(RequestStatus.REJECTED);

        return mapToResponse(member);
    }

    @Override
    public ProjectMemberResponse updateMemberRole(
            UUID projectId,
            UUID currentUserId,
            UUID userId,
            ProjectMemberRequest request
    ) {

        ProjectMember currentMember =
                getProjectMember(
                        projectId,
                        currentUserId
                );

        ProjectMember targetMember =
                getProjectMember(
                        projectId,
                        userId
                );

        checkCanModifyMember(
                currentMember,
                targetMember,
                request.role()
        );

        targetMember.setRole(request.role());

        return mapToResponse(targetMember);
    }

    @Override
    public void removeMember(
            UUID projectId,
            UUID currentUserId,
            UUID userId
    ) {

        ProjectMember currentMember =
                getProjectMember(
                        projectId,
                        currentUserId
                );

        ProjectMember targetMember =
                getProjectMember(
                        projectId,
                        userId
                );

        checkCanRemoveMember(
                currentMember,
                targetMember
        );

        projectMemberRepository.delete(targetMember);
    }

    /**
     * Checks whether the current user can manage project members.
     */
    private void checkManagementPermission(
            UUID projectId,
            UUID currentUserId
    ) {

        User currentUser = userRepository.findById(currentUserId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Current user not found"
                        )
                );

        // ADMIN can manage every project
        if (currentUser.getRole() == UserRole.ADMIN) {
            return;
        }

        ProjectMember currentMember =
                projectMemberRepository
                        .findByProjectIdAndUser(
                                projectId,
                                currentUser
                        )
                        .orElseThrow(() ->
                                new ForbiddenException(
                                        "You are not a member of this project"
                                )
                        );

        if (currentMember.getStatus() != RequestStatus.ACCEPTED) {
            throw new ForbiddenException(
                    "You are not an active project member"
            );
        }

        if (currentMember.getRole() != ProjectMemberRole.OWNER
                && currentMember.getRole() != ProjectMemberRole.MANAGER) {

            throw new ForbiddenException(
                    "Only project owners and managers can manage members"
            );
        }
    }

    /**
     * Checks whether one project member can modify another member.
     */
    private void checkCanModifyMember(
            ProjectMember currentMember,
            ProjectMember targetMember,
            ProjectMemberRole newRole
    ) {

        validateActiveMember(currentMember);
        validateActiveMember(targetMember);

        // OWNER can manage project members
        if (currentMember.getRole() == ProjectMemberRole.OWNER) {
            return;
        }

        // MANAGER rules
        if (currentMember.getRole() == ProjectMemberRole.MANAGER) {

            // Manager cannot modify OWNER
            if (targetMember.getRole() == ProjectMemberRole.OWNER) {
                throw new ForbiddenException(
                        "Managers cannot modify the project owner"
                );
            }

            // Manager cannot promote someone to OWNER
            if (newRole == ProjectMemberRole.OWNER) {
                throw new ForbiddenException(
                        "Managers cannot assign the OWNER role"
                );
            }

            return;
        }

        throw new ForbiddenException(
                "You do not have permission to modify project members"
        );
    }

    /**
     * Checks whether one project member can remove another member.
     */
    private void checkCanRemoveMember(
            ProjectMember currentMember,
            ProjectMember targetMember
    ) {

        validateActiveMember(currentMember);
        validateActiveMember(targetMember);

        // Never allow removing the project owner
        if (targetMember.getRole() == ProjectMemberRole.OWNER) {
            throw new ForbiddenException(
                    "The project owner cannot be removed"
            );
        }

        // OWNER can remove anyone except themselves/owner
        if (currentMember.getRole() == ProjectMemberRole.OWNER) {
            return;
        }

        // MANAGER can remove non-owner members
        if (currentMember.getRole() == ProjectMemberRole.MANAGER) {
            return;
        }

        throw new ForbiddenException(
                "You do not have permission to remove project members"
        );
    }

    private void validateActiveMember(
            ProjectMember member
    ) {

        if (member.getStatus() != RequestStatus.ACCEPTED) {
            throw new ForbiddenException(
                    "Project membership is not active"
            );
        }
    }

    private ProjectMember getProjectMember(
            UUID projectId,
            UUID userId
    ) {

        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "User not found"
                        )
                );

        return projectMemberRepository
                .findByProjectIdAndUser(
                        projectId,
                        user
                )
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Project member not found"
                        )
                );
    }

    private ProjectMember findPendingMembership(
            UUID projectId,
            UUID userId
    ) {

        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "User not found"
                        )
                );

        return projectMemberRepository
                .findByProjectIdAndUserAndStatus(
                        projectId,
                        user,
                        RequestStatus.PENDING
                )
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Pending project invitation not found"
                        )
                );
    }

    private Project getProject(UUID projectId) {

        return projectRepository.findById(projectId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Project not found"
                        )
                );
    }

    private ProjectMemberResponse mapToResponse(
            ProjectMember member
    ) {

        return new ProjectMemberResponse(
                member.getId(),
                member.getUser().getId(),
                member.getUser().getFirstName(),
                member.getUser().getLastName(),
                member.getRole(),
                member.getStatus()
        );
    }
}
