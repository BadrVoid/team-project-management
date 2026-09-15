package com.badr.teamprojectmanagement.team.service;

import com.badr.teamprojectmanagement.common.enums.NotificationType;
import com.badr.teamprojectmanagement.common.enums.TeamJoinRequestStatus;
import com.badr.teamprojectmanagement.common.enums.TeamMemberRole;
import com.badr.teamprojectmanagement.exception.BadRequestException;
import com.badr.teamprojectmanagement.exception.ResourceNotFoundException;
import com.badr.teamprojectmanagement.notification.service.NotificationService;
import com.badr.teamprojectmanagement.team.Team;
import com.badr.teamprojectmanagement.team.TeamJoinRequest;
import com.badr.teamprojectmanagement.team.TeamJoinRequestRepository;
import com.badr.teamprojectmanagement.team.TeamMember;
import com.badr.teamprojectmanagement.team.TeamMemberRepository;
import com.badr.teamprojectmanagement.team.TeamRepository;
import com.badr.teamprojectmanagement.team.dtos.TeamJoinRequestResponse;
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
public class TeamJoinRequestServiceImpl
        implements TeamJoinRequestService {

    private final TeamJoinRequestRepository joinRequestRepository;
    private final TeamRepository teamRepository;
    private final TeamMemberRepository teamMemberRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;


    // JOIN REQUEST FLOW


    @Override
    public TeamJoinRequestResponse sendJoinRequest(
            UUID teamId,
            UUID userId
    ) {

        Team team = findTeam(teamId);
        User user = findUser(userId);

        if (teamMemberRepository.existsByTeamIdAndUser(
                teamId,
                user
        )) {
            throw new BadRequestException(
                    "User is already a team member"
            );
        }

        var existingRequest =
                joinRequestRepository.findByTeamIdAndUser(
                        teamId,
                        user
                );

        if (existingRequest.isPresent()) {

            TeamJoinRequest request = existingRequest.get();

            if (request.getStatus() == TeamJoinRequestStatus.PENDING) {
                throw new BadRequestException(
                        "Join request is already pending"
                );
            }

            request.setStatus(TeamJoinRequestStatus.PENDING);

            joinRequestRepository.save(request);

            return mapToResponse(request);
        }

        TeamJoinRequest request = TeamJoinRequest.builder()
                .team(team)
                .user(user)
                .status(TeamJoinRequestStatus.PENDING)
                .build();

        TeamJoinRequest savedRequest =
                joinRequestRepository.save(request);

        return mapToResponse(savedRequest);
    }

    @Override
    @Transactional(readOnly = true)
    public List<TeamJoinRequestResponse> getTeamJoinRequests(
            UUID teamId,
            UUID currentUserId
    ) {

        if (!teamRepository.existsById(teamId)) {
            throw new ResourceNotFoundException(
                    "Team not found"
            );
        }

        // Only TEAM LEADER can view requests
        verifyTeamLeader(teamId, currentUserId);

        return joinRequestRepository
                .findByTeamIdAndStatus(
                        teamId,
                        TeamJoinRequestStatus.PENDING
                )
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public TeamJoinRequestResponse acceptJoinRequest(
            UUID requestId,
            UUID currentUserId
    ) {

        TeamJoinRequest request = findRequest(requestId);

        UUID teamId = request.getTeam().getId();

        // Only TEAM LEADER can accept requests
        verifyTeamLeader(teamId, currentUserId);

        if (request.getStatus() != TeamJoinRequestStatus.PENDING) {
            throw new BadRequestException(
                    "Join request has already been processed"
            );
        }

        Team team = request.getTeam();
        User user = request.getUser();

        if (teamMemberRepository.existsByTeamIdAndUser(
                teamId,
                user
        )) {
            throw new BadRequestException(
                    "User is already a team member"
            );
        }

        TeamMember member = TeamMember.builder()
                .team(team)
                .user(user)
                .role(TeamMemberRole.MEMBER)
                .build();

        teamMemberRepository.save(member);

        request.setStatus(
                TeamJoinRequestStatus.ACCEPTED
        );

        joinRequestRepository.save(request);

        return mapToResponse(request);
    }

    @Override
    public TeamJoinRequestResponse rejectJoinRequest(
            UUID requestId,
            UUID currentUserId
    ) {

        TeamJoinRequest request = findRequest(requestId);

        UUID teamId = request.getTeam().getId();

        // Only TEAM LEADER can reject requests
        verifyTeamLeader(teamId, currentUserId);

        if (request.getStatus() != TeamJoinRequestStatus.PENDING) {
            throw new BadRequestException(
                    "Join request has already been processed"
            );
        }

        request.setStatus(
                TeamJoinRequestStatus.REJECTED
        );

        joinRequestRepository.save(request);

        return mapToResponse(request);
    }


    // INVITATION FLOW


    @Override
    public TeamJoinRequestResponse inviteUser(
            UUID teamId,
            UUID userId,
            UUID currentUserId
    ) {

        // Only TEAM LEADER can invite users
        verifyTeamLeader(teamId, currentUserId);

        Team team = findTeam(teamId);
        User user = findUser(userId);

        if (teamMemberRepository.existsByTeamIdAndUser(
                teamId,
                user
        )) {
            throw new BadRequestException(
                    "User is already a team member"
            );
        }

        var existingRequest =
                joinRequestRepository.findByTeamIdAndUser(
                        teamId,
                        user
                );

        TeamJoinRequest request;

        if (existingRequest.isPresent()) {

            request = existingRequest.get();

            if (request.getStatus()
                    == TeamJoinRequestStatus.PENDING) {

                throw new BadRequestException(
                        "There is already a pending request or invitation"
                );
            }

            request.setStatus(
                    TeamJoinRequestStatus.PENDING
            );

        } else {

            request = TeamJoinRequest.builder()
                    .team(team)
                    .user(user)
                    .status(TeamJoinRequestStatus.PENDING)
                    .build();
        }

        TeamJoinRequest savedRequest =
                joinRequestRepository.save(request);

        notificationService.createNotification(
                user.getId(),
                NotificationType.TEAM_INVITATION,
                "You have been invited to join team: "
                        + team.getName()
        );

        return mapToResponse(savedRequest);
    }

    @Override
    @Transactional(readOnly = true)
    public List<TeamJoinRequestResponse> getMyInvitations(
            UUID userId
    ) {

        if (!userRepository.existsById(userId)) {
            throw new ResourceNotFoundException(
                    "User not found"
            );
        }

        return joinRequestRepository
                .findByUserIdAndStatus(
                        userId,
                        TeamJoinRequestStatus.PENDING
                )
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public TeamJoinRequestResponse acceptInvitation(
            UUID requestId,
            UUID userId
    ) {

        TeamJoinRequest request = findRequest(requestId);

        // Only invited user can accept
        if (!request.getUser().getId().equals(userId)) {
            throw new AccessDeniedException(
                    "This invitation does not belong to you"
            );
        }

        if (request.getStatus()
                != TeamJoinRequestStatus.PENDING) {

            throw new BadRequestException(
                    "Invitation has already been processed"
            );
        }

        Team team = request.getTeam();
        User user = request.getUser();

        if (teamMemberRepository.existsByTeamIdAndUser(
                team.getId(),
                user
        )) {
            throw new BadRequestException(
                    "User is already a team member"
            );
        }

        TeamMember member = TeamMember.builder()
                .team(team)
                .user(user)
                .role(TeamMemberRole.MEMBER)
                .build();

        teamMemberRepository.save(member);

        request.setStatus(
                TeamJoinRequestStatus.ACCEPTED
        );

        joinRequestRepository.save(request);

        return mapToResponse(request);
    }

    @Override
    public TeamJoinRequestResponse rejectInvitation(
            UUID requestId,
            UUID userId
    ) {

        TeamJoinRequest request = findRequest(requestId);

        // Only invited user can reject
        if (!request.getUser().getId().equals(userId)) {
            throw new AccessDeniedException(
                    "This invitation does not belong to you"
            );
        }

        if (request.getStatus()
                != TeamJoinRequestStatus.PENDING) {

            throw new BadRequestException(
                    "Invitation has already been processed"
            );
        }

        request.setStatus(
                TeamJoinRequestStatus.REJECTED
        );

        joinRequestRepository.save(request);

        return mapToResponse(request);
    }


    // AUTHORIZATION


    private void verifyTeamLeader(
            UUID teamId,
            UUID userId
    ) {

        boolean isLeader = teamMemberRepository
                .findByTeamIdAndUserId(
                        teamId,
                        userId
                )
                .map(member ->
                        member.getRole()
                                == TeamMemberRole.LEADER
                )
                .orElse(false);

        if (!isLeader) {
            throw new AccessDeniedException(
                    "You are not allowed to manage this team"
            );
        }
    }


    // HELPERS


    private Team findTeam(UUID teamId) {

        return teamRepository.findById(teamId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Team not found"
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

    private TeamJoinRequest findRequest(UUID requestId) {

        return joinRequestRepository.findById(requestId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Team join request not found"
                        )
                );
    }

    private TeamJoinRequestResponse mapToResponse(
            TeamJoinRequest request
    ) {

        return new TeamJoinRequestResponse(
                request.getId(),
                request.getTeam().getId(),
                request.getUser().getId(),
                request.getStatus()
        );
    }
}