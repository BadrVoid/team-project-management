package com.badr.teamprojectmanagement.team.service;

import com.badr.teamprojectmanagement.common.enums.NotificationType;
import com.badr.teamprojectmanagement.common.enums.ProjectMemberRole;
import com.badr.teamprojectmanagement.common.enums.RequestStatus;
import com.badr.teamprojectmanagement.common.enums.SpaceMemberRole;
import com.badr.teamprojectmanagement.common.enums.TeamMemberRole;
import com.badr.teamprojectmanagement.common.enums.UserRole;
import com.badr.teamprojectmanagement.exception.BadRequestException;
import com.badr.teamprojectmanagement.exception.ForbiddenException;
import com.badr.teamprojectmanagement.exception.ResourceNotFoundException;
import com.badr.teamprojectmanagement.notification.service.NotificationService;
import com.badr.teamprojectmanagement.project.Project;
import com.badr.teamprojectmanagement.project.ProjectMember;
import com.badr.teamprojectmanagement.project.ProjectMemberRepository;
import com.badr.teamprojectmanagement.space.Space;
import com.badr.teamprojectmanagement.space.SpaceMember;
import com.badr.teamprojectmanagement.space.SpaceMemberRepository;
import com.badr.teamprojectmanagement.team.Team;
import com.badr.teamprojectmanagement.team.TeamMember;
import com.badr.teamprojectmanagement.team.TeamMemberRepository;
import com.badr.teamprojectmanagement.team.TeamRepository;
import com.badr.teamprojectmanagement.team.dtos.TeamMemberRequest;
import com.badr.teamprojectmanagement.team.dtos.TeamMemberResponse;
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
public class TeamMemberServiceImpl implements TeamMemberService {

    private final TeamMemberRepository teamMemberRepository;
    private final TeamRepository teamRepository;
    private final UserRepository userRepository;

    private final ProjectMemberRepository projectMemberRepository;
    private final SpaceMemberRepository spaceMemberRepository;

    private final NotificationService notificationService;

    @Override
    public TeamMemberResponse addMember(
            UUID teamId,
            UUID currentUserId,
            TeamMemberRequest request
    ) {
        Team team = getTeam(teamId);

        // Only ADMIN or accepted TEAM LEADER can manage members
        checkManagementPermission(teamId, currentUserId);

        User user = userRepository.findById(request.userId())
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found")
                );

        if (teamMemberRepository.existsByTeamIdAndUserId(
                teamId,
                user.getId()
        )) {
            throw new BadRequestException(
                    "User is already a member or has a pending invitation"
            );
        }

        TeamMember member = TeamMember.builder()
                .team(team)
                .user(user)
                .role(request.role())
                .status(RequestStatus.PENDING)
                .build();

        teamMemberRepository.save(member);

        notificationService.createNotification(
                user.getId(),
                NotificationType.TEAM_INVITATION,
                "You have been invited to the team: " + team.getName(),
                team.getId()
        );

        return mapToResponse(member);
    }

    @Override
    @Transactional(readOnly = true)
    public List<TeamMemberResponse> getTeamMembers(UUID teamId) {

        if (!teamRepository.existsById(teamId)) {
            throw new ResourceNotFoundException("Team not found");
        }

        return teamMemberRepository
                .findByTeamIdAndStatus(
                        teamId,
                        RequestStatus.ACCEPTED
                )
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public TeamMemberResponse acceptInvitation(
            UUID teamId,
            UUID userId
    ) {
        TeamMember member = getPendingInvitation(teamId, userId);

        User user = member.getUser();
        Team team = member.getTeam();

        /*
         * Accept the team invitation.
         */
        member.setStatus(RequestStatus.ACCEPTED);

        /*
         * Team
         *   └── Project
         *         └── Space
         */
        Project project = team.getProject();
        Space space = project.getSpace();

        /*
         * Accept/create project membership.
         */
        ensureProjectMembership(
                project,
                user
        );

        /*
         * Create space membership if necessary.
         */
        ensureSpaceMembership(
                space,
                user
        );

        teamMemberRepository.save(member);

        return mapToResponse(member);
    }

    @Override
    public TeamMemberResponse rejectInvitation(
            UUID teamId,
            UUID userId
    ) {
        TeamMember member = getPendingInvitation(teamId, userId);

        member.setStatus(RequestStatus.REJECTED);

        teamMemberRepository.save(member);

        return mapToResponse(member);
    }

    @Override
    public TeamMemberResponse updateMemberRole(
            UUID teamId,
            UUID currentUserId,
            UUID userId,
            TeamMemberRequest request
    ) {
        checkManagementPermission(teamId, currentUserId);

        TeamMember member = teamMemberRepository
                .findByTeamIdAndUserId(teamId, userId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Team member not found"
                        )
                );

        if (member.getStatus() != RequestStatus.ACCEPTED) {
            throw new BadRequestException(
                    "Only accepted members can have their role updated"
            );
        }

        member.setRole(request.role());

        teamMemberRepository.save(member);

        return mapToResponse(member);
    }

    @Override
    public void removeMember(
            UUID teamId,
            UUID currentUserId,
            UUID userId
    ) {
        checkManagementPermission(teamId, currentUserId);

        TeamMember member = teamMemberRepository
                .findByTeamIdAndUserId(teamId, userId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Team member not found"
                        )
                );

        teamMemberRepository.delete(member);
    }

    /**
     * Ensures that the user has accepted membership
     * in the parent project.
     */
    private void ensureProjectMembership(
            Project project,
            User user
    ) {
        var existingMembership =
                projectMemberRepository.findByProjectIdAndUser(
                        project.getId(),
                        user
                );

        if (existingMembership.isPresent()) {

            ProjectMember member = existingMembership.get();

            /*
             * The accepted team invitation grants
             * access to the parent project.
             */
            member.setStatus(RequestStatus.ACCEPTED);

            return;
        }

        /*
         * User has no project membership yet.
         */
        ProjectMember member = ProjectMember.builder()
                .project(project)
                .user(user)
                .role(ProjectMemberRole.MEMBER)
                .status(RequestStatus.ACCEPTED)
                .build();

        projectMemberRepository.save(member);
    }

    /**
     * Ensures that the user is a member
     * of the parent space.
     */
    private void ensureSpaceMembership(
            Space space,
            User user
    ) {
        boolean alreadyMember =
                spaceMemberRepository.existsBySpaceIdAndUserId(
                        space.getId(),
                        user.getId()
                );

        if (alreadyMember) {
            return;
        }

        SpaceMember member = SpaceMember.builder()
                .space(space)
                .user(user)
                .role(SpaceMemberRole.MEMBER)
                .build();

        spaceMemberRepository.save(member);
    }

    /**
     * Gets a pending team invitation for a specific user.
     */
    private TeamMember getPendingInvitation(
            UUID teamId,
            UUID userId
    ) {
        return teamMemberRepository
                .findByTeamIdAndUserIdAndStatus(
                        teamId,
                        userId,
                        RequestStatus.PENDING
                )
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Pending team invitation not found"
                        )
                );
    }

    /**
     * Checks whether the current user can manage this team.
     *
     * ADMIN:
     * Can manage every team.
     *
     * TEAM LEADER:
     * Can manage the team only if they are an accepted LEADER.
     *
     * MEMBER:
     * Cannot manage team members.
     */
    private void checkManagementPermission(
            UUID teamId,
            UUID currentUserId
    ) {
        User currentUser = userRepository.findById(currentUserId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Current user not found"
                        )
                );

        // ADMIN can manage every team
        if (currentUser.getRole() == UserRole.ADMIN) {
            return;
        }

        TeamMember currentMember = teamMemberRepository
                .findByTeamIdAndUserId(teamId, currentUserId)
                .orElseThrow(() ->
                        new ForbiddenException(
                                "You are not a member of this team"
                        )
                );

        // Pending/rejected users cannot manage the team
        if (currentMember.getStatus() != RequestStatus.ACCEPTED) {
            throw new ForbiddenException(
                    "You must accept the team invitation first"
            );
        }

        // Only LEADER can manage
        if (currentMember.getRole() != TeamMemberRole.LEADER) {
            throw new ForbiddenException(
                    "Only team leaders can manage team members"
            );
        }
    }

    private Team getTeam(UUID teamId) {
        return teamRepository.findById(teamId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Team not found"
                        )
                );
    }

    private TeamMemberResponse mapToResponse(TeamMember member) {
        User user = member.getUser();

        return new TeamMemberResponse(
                member.getId(),
                member.getTeam().getId(),
                user.getId(),
                user.getFirstName(),
                user.getLastName(),
                user.getEmail(),
                member.getRole(),
                member.getStatus()
        );
    }
}