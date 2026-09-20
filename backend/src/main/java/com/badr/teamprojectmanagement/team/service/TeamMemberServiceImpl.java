
package com.badr.teamprojectmanagement.team.service;

import com.badr.teamprojectmanagement.common.enums.NotificationType;
import com.badr.teamprojectmanagement.common.enums.UserRole;
import com.badr.teamprojectmanagement.exception.BadRequestException;
import com.badr.teamprojectmanagement.exception.ForbiddenException;
import com.badr.teamprojectmanagement.exception.ResourceNotFoundException;
import com.badr.teamprojectmanagement.notification.service.NotificationService;
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
    private final NotificationService notificationService;
    @Override
    public TeamMemberResponse addMember(
            UUID teamId,
            UUID currentUserId,
            TeamMemberRequest request
    ) {

        Team team = getTeam(teamId);

        // Only ADMIN or TEAM LEADER can manage members
        checkManagementPermission(teamId, currentUserId);

        // Find user to add
        User user = userRepository.findById(request.userId())
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found")
                );

        // Check if user is already a member
        if (teamMemberRepository.existsByTeamIdAndUser(teamId, user)) {
            throw new BadRequestException(
                    "User is already a team member"
            );
        }

        TeamMember member = TeamMember.builder()
                .team(team)
                .user(user)
                .role(request.role())
                .build();

        teamMemberRepository.save(member);
        notificationService.createNotification(
                user.getId(),
                NotificationType.TEAM_INVITATION,
                "You have been added to the team: " + team.getName()
        );
        return mapToResponse(member);
    }

    @Override
    @Transactional(readOnly = true)
    public List<TeamMemberResponse> getTeamMembers(UUID teamId) {

        // Check team exists
        if (!teamRepository.existsById(teamId)) {
            throw new ResourceNotFoundException("Team not found");
        }

        return teamMemberRepository.findByTeamId(teamId)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public TeamMemberResponse updateMemberRole(
            UUID teamId,
            UUID currentUserId,
            UUID userId,
            TeamMemberRequest request
    ) {

        // Only ADMIN or TEAM LEADER can manage members
        checkManagementPermission(teamId, currentUserId);

        // Find user
        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found")
                );

        // Find team member
        TeamMember member = teamMemberRepository
                .findByTeamIdAndUser(teamId, user)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Team member not found"
                        )
                );

        // Update role
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

        // Only ADMIN or TEAM LEADER can manage members
        checkManagementPermission(teamId, currentUserId);

        // Find user
        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found")
                );

        // Find team member
        TeamMember member = teamMemberRepository
                .findByTeamIdAndUser(teamId, user)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Team member not found"
                        )
                );

        teamMemberRepository.delete(member);
    }

    /**
     * Checks whether the current user can manage this team.
     * <p>
     * ADMIN:
     * Can manage every team.
     * <p>
     * TEAM LEADER:
     * Can manage the team they belong to as LEADER.
     * <p>
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

        // Check whether current user is a member of this team
        TeamMember currentMember = teamMemberRepository
                .findByTeamIdAndUser(teamId, currentUser)
                .orElseThrow(() ->
                        new ForbiddenException(
                                "You are not a member of this team"
                        )
                );

        // Only LEADER can manage
        if (currentMember.getRole() !=
                com.badr.teamprojectmanagement.common.enums.TeamMemberRole.LEADER) {

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
                member.getRole()
        );
    }
}

