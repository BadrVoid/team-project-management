package com.badr.teamprojectmanagement.project.service;

import com.badr.teamprojectmanagement.common.enums.JoinRequestStatus;
import com.badr.teamprojectmanagement.exception.BadRequestException;
import com.badr.teamprojectmanagement.exception.ResourceNotFoundException;
import com.badr.teamprojectmanagement.project.*;
import com.badr.teamprojectmanagement.project.dtos.ProjectJoinRequestResponse;
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
public class ProjectJoinRequestServiceImpl
        implements ProjectJoinRequestService {

    private final ProjectJoinRequestRepository joinRequestRepository;
    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;
    private final ProjectMemberRepository projectMemberRepository;

    @Override
    public ProjectJoinRequestResponse sendJoinRequest(
            UUID projectId,
            UUID userId
    ) {

        //Find project
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Project not found")
                );

        //Find user
        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found")
                );

        //Check if user is already a project member
        if (projectMemberRepository.existsByProjectIdAndUser(
                projectId,
                user
        )) {
            throw new BadRequestException(
                    "User is already a project member"
            );
        }

        //Check if there is already a join request
        var existingRequest =
                joinRequestRepository.findByProjectIdAndUser(
                        projectId,
                        user
                );

        if (existingRequest.isPresent()) {

            ProjectJoinRequest request = existingRequest.get();

            //Don't allow another pending request
            if (request.getStatus() == JoinRequestStatus.PENDING) {
                throw new BadRequestException(
                        "Join request is already pending"
                );
            }

            //Allow user to request again after rejection
            request.setStatus(JoinRequestStatus.PENDING);

            joinRequestRepository.save(request);

            return mapToResponse(request);
        }

        //Create new join request
        ProjectJoinRequest request = ProjectJoinRequest.builder()
                .project(project)
                .user(user)
                .status(JoinRequestStatus.PENDING)
                .build();

        //Save request
        joinRequestRepository.save(request);

        return mapToResponse(request);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProjectJoinRequestResponse> getProjectJoinRequests(
            UUID projectId
    ) {

        //Check project exists
        if (!projectRepository.existsById(projectId)) {
            throw new ResourceNotFoundException("Project not found");
        }

        //Find pending requests
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
            UUID requestId
    ) {

        //Find join request
        ProjectJoinRequest request =
                joinRequestRepository.findById(requestId)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Join request not found"
                                )
                        );

        //Check request is still pending
        if (request.getStatus() != JoinRequestStatus.PENDING) {
            throw new BadRequestException(
                    "Join request has already been processed"
            );
        }

        //Check user is not already a member
        if (projectMemberRepository.existsByProjectIdAndUser(
                request.getProject().getId(),
                request.getUser()
        )) {
            throw new BadRequestException(
                    "User is already a project member"
            );
        }

        //Create project member
        ProjectMember member = ProjectMember.builder()
                .project(request.getProject())
                .user(request.getUser())
                .role(
                        com.badr.teamprojectmanagement.common.enums
                                .ProjectMemberRole.MEMBER
                )
                .build();

        //Save project member
        projectMemberRepository.save(member);

        //Mark request as accepted
        request.setStatus(JoinRequestStatus.ACCEPTED);

        //Save updated request
        joinRequestRepository.save(request);

        return mapToResponse(request);
    }

    @Override
    public ProjectJoinRequestResponse rejectJoinRequest(
            UUID requestId
    ) {

        //Find join request
        ProjectJoinRequest request =
                joinRequestRepository.findById(requestId)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Join request not found"
                                )
                        );

        //Check request is still pending
        if (request.getStatus() != JoinRequestStatus.PENDING) {
            throw new BadRequestException(
                    "Join request has already been processed"
            );
        }

        //Reject request
        request.setStatus(JoinRequestStatus.REJECTED);

        //Save updated request
        joinRequestRepository.save(request);

        return mapToResponse(request);
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