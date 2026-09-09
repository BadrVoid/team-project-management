package com.badr.teamprojectmanagement.task.service;

import com.badr.teamprojectmanagement.exception.ForbiddenException;
import com.badr.teamprojectmanagement.exception.ResourceNotFoundException;
import com.badr.teamprojectmanagement.task.Task;
import com.badr.teamprojectmanagement.task.TaskComment;
import com.badr.teamprojectmanagement.task.TaskCommentRepository;
import com.badr.teamprojectmanagement.task.TaskRepository;
import com.badr.teamprojectmanagement.task.dtos.CommentCreateRequest;
import com.badr.teamprojectmanagement.task.dtos.CommentResponse;
import com.badr.teamprojectmanagement.task.dtos.CommentUpdateRequest;
import com.badr.teamprojectmanagement.team.TeamMemberRepository;
import com.badr.teamprojectmanagement.user.User;
import com.badr.teamprojectmanagement.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@Transactional
@RequiredArgsConstructor
public class TaskCommentServiceImpl implements TaskCommentService {

    private final TaskCommentRepository taskCommentRepository;
    private final TaskRepository taskRepository;
    private final TeamMemberRepository teamMemberRepository;
    private final UserRepository userRepository;

    @Override
    public CommentResponse createComment(
            UUID taskId,
            UUID userId,
            CommentCreateRequest request
    ) {

        Task task = findTask(taskId);
        User user = findUser(userId);

        checkTeamMember(
                task.getTeam().getId(),
                userId
        );

        TaskComment comment = TaskComment.builder()
                .task(task)
                .user(user)
                .content(request.content())
                .build();

        TaskComment savedComment =
                taskCommentRepository.save(comment);

        return mapToResponse(savedComment);
    }

    @Override
    @Transactional(readOnly = true)
    public CommentResponse getCommentById(UUID commentId) {

        TaskComment comment = findComment(commentId);

        return mapToResponse(comment);
    }

    @Override
    @Transactional(readOnly = true)
    public List<CommentResponse> getCommentsByTask(UUID taskId) {

        Task task = findTask(taskId);

        return taskCommentRepository
                .findAllByTaskIdOrderByCreatedAtAsc(task.getId())
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public CommentResponse updateComment(
            UUID commentId,
            UUID userId,
            CommentUpdateRequest request
    ) {

        TaskComment comment = findComment(commentId);

        checkTeamMember(
                comment.getTask().getTeam().getId(),
                userId
        );

        if (!comment.getUser().getId().equals(userId)) {
            throw new ForbiddenException(
                    "You can only update your own comment"
            );
        }

        comment.setContent(request.content());

        TaskComment updatedComment =
                taskCommentRepository.save(comment);

        return mapToResponse(updatedComment);
    }

    @Override
    public void deleteComment(
            UUID commentId,
            UUID userId
    ) {

        TaskComment comment = findComment(commentId);

        checkTeamMember(
                comment.getTask().getTeam().getId(),
                userId
        );

        if (!comment.getUser().getId().equals(userId)) {
            throw new ForbiddenException(
                    "You can only delete your own comment"
            );
        }

        taskCommentRepository.delete(comment);
    }

    private Task findTask(UUID taskId) {

        return taskRepository.findById(taskId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Task not found"
                        )
                );
    }

    private TaskComment findComment(UUID commentId) {

        return taskCommentRepository.findById(commentId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Comment not found"
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

    private void checkTeamMember(
            UUID teamId,
            UUID userId
    ) {

        boolean isMember =
                teamMemberRepository.existsByTeamIdAndUserId(
                        teamId,
                        userId
                );

        if (!isMember) {
            throw new ForbiddenException(
                    "User is not a member of this team"
            );
        }
    }

    private CommentResponse mapToResponse(
            TaskComment comment
    ) {

        return new CommentResponse(
                comment.getId(),
                comment.getTask().getId(),
                comment.getUser().getId(),
                comment.getUser().getFirstName(),
                comment.getUser().getLastName(),
                comment.getContent(),
                comment.getCreatedAt(),
                comment.getUpdatedAt()
        );
    }
}