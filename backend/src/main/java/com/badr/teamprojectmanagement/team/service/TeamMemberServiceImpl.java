package com.badr.teamprojectmanagement.team.service;

import com.badr.teamprojectmanagement.exception.BadRequestException;
import com.badr.teamprojectmanagement.exception.ResourceNotFoundException;
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

    @Override
    public TeamMemberResponse addMember(
            UUID teamId,
            TeamMemberRequest request
    ) {

        //Check team exists
        if (!teamRepository.existsById(teamId)) {
            throw new ResourceNotFoundException("Team not found");
        }

        //Find user
        User user = userRepository.findById(request.userId())
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found")
                );

        //Check if user is already a member
        if (teamMemberRepository.existsByTeamIdAndUser(teamId, user)) {
            throw new BadRequestException("User is already a team member");
        }

        //Find team
        Team team = teamRepository.findById(teamId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Team not found")
                );

        //Create member
        TeamMember member = TeamMember.builder()
                .team(team)
                .user(user)
                .role(request.role())
                .build();

        //Save member
        teamMemberRepository.save(member);

        return mapToResponse(member);
    }

    @Override
    @Transactional(readOnly = true)
    public List<TeamMemberResponse> getTeamMembers(UUID teamId) {

        //Check team exists
        if (!teamRepository.existsById(teamId)) {
            throw new ResourceNotFoundException("Team not found");
        }

        //Find team members
        return teamMemberRepository.findByTeamId(teamId)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public TeamMemberResponse updateMemberRole(
            UUID teamId,
            UUID userId,
            TeamMemberRequest request
    ) {

        //Find user
        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found")
                );

        //Find team member
        TeamMember member = teamMemberRepository
                .findByTeamIdAndUser(teamId, user)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Team member not found")
                );

        //Update member role
        member.setRole(request.role());

        //Save updated member
        teamMemberRepository.save(member);

        return mapToResponse(member);
    }

    @Override
    public void removeMember(UUID teamId, UUID userId) {

        //Find user
        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found")
                );

        //Find team member
        TeamMember member = teamMemberRepository
                .findByTeamIdAndUser(teamId, user)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Team member not found")
                );

        //Remove member
        teamMemberRepository.delete(member);
    }

    private TeamMemberResponse mapToResponse(TeamMember member) {

        return new TeamMemberResponse(
                member.getId(),
                member.getTeam().getId(),
                member.getUser().getId(),
                member.getRole()
        );
    }
}