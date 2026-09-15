package com.badr.teamprojectmanagement.task.service;

import com.badr.teamprojectmanagement.common.enums.NotificationType;
import com.badr.teamprojectmanagement.common.enums.TeamMemberRole;
import com.badr.teamprojectmanagement.exception.ResourceNotFoundException;
import com.badr.teamprojectmanagement.notification.service.NotificationService;
import com.badr.teamprojectmanagement.task.Task;
import com.badr.teamprojectmanagement.task.TaskComment;
import com.badr.teamprojectmanagement.task.TaskCommentRepository;
import com.badr.teamprojectmanagement.task.TaskMapper;
import com.badr.teamprojectmanagement.task.TaskRepository;
import com.badr.teamprojectmanagement.task.dtos.TaskCommentCreateRequest;
import com.badr.teamprojectmanagement.task.dtos.TaskCommentResponse;
import com.badr.teamprojectmanagement.task.dtos.TaskCommentUpdateRequest;
import com.badr.teamprojectmanagement.team.TeamMemberRepository;
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
public class TaskCommentServiceImpl implements TaskCommentService {

    private final TaskCommentRepository taskCommentRepository;
    private final TaskRepository taskRepository;
    private final UserRepository userRepository;
    private final TeamMemberRepository teamMemberRepository;
    private final TaskMapper taskMapper;
    private final NotificationService notificationService;
    @Override
    public TaskCommentResponse createComment(
            UUID taskId,
            UUID userId,
            TaskCommentCreateRequest request) {

        Task task = findTask(taskId);
        User user = findUser(userId);

        verifyTeamMember(task, userId);

        TaskComment comment = TaskComment.builder()
                .task(task)
                .user(user)
                .content(request.content())
                .build();

        TaskComment savedComment = taskCommentRepository.save(comment);

        // Notify task creator
        if (!task.getCreatedBy().getId().equals(userId)) {
            notificationService.createNotification(
                    task.getCreatedBy().getId(),
                    NotificationType.TASK_COMMENTED,
                    user.getFirstName() + " " + user.getLastName()
                            + " commented on your task: " + task.getTitle()
            );
        }

        // Notify assigned user
        if (task.getAssignedTo() != null
                && !task.getAssignedTo().getId().equals(userId)
                && !task.getAssignedTo().getId().equals(task.getCreatedBy().getId())) {

            notificationService.createNotification(
                    task.getAssignedTo().getId(),
                    NotificationType.TASK_COMMENTED,
                    user.getFirstName() + " " + user.getLastName()
                            + " commented on your assigned task: " + task.getTitle()
            );
        }

        return taskMapper.toCommentResponse(savedComment);
    }

    @Override
    @Transactional(readOnly = true)
    public List<TaskCommentResponse> getTaskComments(
            UUID taskId,
            UUID userId
    ) {

        Task task = findTask(taskId);

        verifyTeamMember(task, userId);

        return taskCommentRepository
                .findByTaskIdOrderByCreatedAtAsc(task.getId())
                .stream()
                .map(taskMapper::toCommentResponse)
                .toList();
    }

    @Override
    public TaskCommentResponse updateComment(
            UUID commentId,
            UUID userId,
            TaskCommentUpdateRequest request
    ) {

        TaskComment comment = findComment(commentId);

        verifyCommentOwner(comment, userId);

        comment.setContent(request.content());

        return taskMapper.toCommentResponse(comment);
    }

    @Override
    public void deleteComment(
            UUID commentId,
            UUID userId
    ) {

        TaskComment comment = findComment(commentId);

        boolean isOwner =
                comment.getUser().getId().equals(userId);

        boolean isTeamLeader =
                isTeamLeader(
                        comment.getTask().getTeam().getId(),
                        userId
                );

        if (!isOwner && !isTeamLeader) {
            throw new AccessDeniedException(
                    "You are not allowed to delete this comment"
            );
        }

        taskCommentRepository.delete(comment);
    }

    private Task findTask(UUID taskId) {
        return taskRepository.findById(taskId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Task not found"
                        ));
    }

    private TaskComment findComment(UUID commentId) {
        return taskCommentRepository.findById(commentId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Comment not found"
                        ));
    }

    private User findUser(UUID userId) {
        return userRepository.findById(userId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "User not found"
                        ));
    }

    private void verifyTeamMember(
            Task task,
            UUID userId
    ) {

        boolean isMember =
                teamMemberRepository.existsByTeamIdAndUserId(
                        task.getTeam().getId(),
                        userId
                );

        if (!isMember) {
            throw new AccessDeniedException(
                    "You must be a team member to access this task's comments"
            );
        }
    }

    private void verifyCommentOwner(
            TaskComment comment,
            UUID userId
    ) {

        if (!comment.getUser().getId().equals(userId)) {
            throw new AccessDeniedException(
                    "You can only edit your own comments"
            );
        }
    }

    private boolean isTeamLeader(
            UUID teamId,
            UUID userId
    ) {

        return teamMemberRepository
                .findByTeamIdAndUserId(teamId, userId)
                .map(member ->
                        member.getRole() == TeamMemberRole.LEADER
                )
                .orElse(false);
    }
}