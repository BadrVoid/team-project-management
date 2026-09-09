package com.badr.teamprojectmanagement.project.service;

import com.badr.teamprojectmanagement.common.enums.MembershipStatus;
import com.badr.teamprojectmanagement.exception.BadRequestException;
import com.badr.teamprojectmanagement.exception.ResourceNotFoundException;
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

    @Override
    public ProjectMemberResponse inviteMember(
            UUID projectId,
            ProjectMemberRequest request
    ) {

        //Check Project Exsit
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Project not found")
                );

        //Check User Exsit
        User user = userRepository.findById(request.userId())
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found")
                );

        // Check existing membership
        var existingMember = projectMemberRepository
                .findByProjectIdAndUser(projectId, user);

        if (existingMember.isPresent()) {

            ProjectMember member = existingMember.get();

            // Reactivate rejected invitation
            if (member.getStatus() == MembershipStatus.REJECTED) {
                member.setStatus(MembershipStatus.PENDING);
                member.setRole(request.role());

                return mapToResponse(member);
            }

            throw new BadRequestException(
                    "User already has an active or pending membership"
            );
        }

        // Create new invitation
        ProjectMember member = ProjectMember.builder()
                .project(project)
                .user(user)
                .role(request.role())
                .status(MembershipStatus.PENDING)
                .build();

        projectMemberRepository.save(member);

        return mapToResponse(member);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProjectMemberResponse> getProjectMembers(UUID projectId) {

        // Check project exists
        if (!projectRepository.existsById(projectId)) {
            throw new ResourceNotFoundException("Project not found");
        }

        return projectMemberRepository.findByProjectId(projectId)
                .stream()
                .filter(member ->
                        member.getStatus() == MembershipStatus.ACCEPTED
                )
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProjectMemberResponse> getMyInvitations(UUID userId) {

        // Find user
        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found")
                );

        return projectMemberRepository
                .findByUserAndStatus(user, MembershipStatus.PENDING)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public ProjectMemberResponse acceptInvitation(
            UUID projectId,
            UUID userId
    ) {

        ProjectMember member = findPendingMembership(
                projectId,
                userId
        );

        member.setStatus(MembershipStatus.ACCEPTED);

        return mapToResponse(member);
    }

    @Override
    public ProjectMemberResponse rejectInvitation(
            UUID projectId,
            UUID userId
    ) {

        ProjectMember member = findPendingMembership(
                projectId,
                userId
        );

        member.setStatus(MembershipStatus.REJECTED);

        return mapToResponse(member);
    }

    @Override
    public ProjectMemberResponse updateMemberRole(
            UUID projectId,
            UUID userId,
            ProjectMemberRequest request
    ) {

        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found")
                );

        ProjectMember member = projectMemberRepository
                .findByProjectIdAndUser(projectId, user)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Project member not found"
                        )
                );

        member.setRole(request.role());

        return mapToResponse(member);
    }

    @Override
    public void removeMember(
            UUID projectId,
            UUID userId
    ) {

        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found")
                );

        ProjectMember member = projectMemberRepository
                .findByProjectIdAndUser(projectId, user)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Project member not found"
                        )
                );

        projectMemberRepository.delete(member);
    }

    private ProjectMember findPendingMembership(
            UUID projectId,
            UUID userId
    ) {

        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found")
                );

        return projectMemberRepository
                .findByProjectIdAndUserAndStatus(
                        projectId,
                        user,
                        MembershipStatus.PENDING
                )
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Pending project invitation not found"
                        )
                );
    }

    private ProjectMemberResponse mapToResponse(
            ProjectMember member
    ) {

        return new ProjectMemberResponse(
                member.getId(),
                member.getProject().getId(),
                member.getUser().getId(),
                member.getRole(),
                member.getStatus()
        );
    }
}