package com.badr.teamprojectmanagement.task;

import com.badr.teamprojectmanagement.task.dtos.TaskCommentResponse;
import com.badr.teamprojectmanagement.task.dtos.TaskDetailsResponse;
import com.badr.teamprojectmanagement.task.dtos.TaskResponse;
import com.badr.teamprojectmanagement.user.User;
import com.badr.teamprojectmanagement.user.dtos.UserSummaryResponse;
import org.springframework.stereotype.Component;

import java.util.UUID;

@Component
public class TaskMapper {

    public TaskResponse toResponse(Task task) {
        return new TaskResponse(
                task.getId(),
                task.getTeam().getId(),
                task.getTitle(),
                task.getDescription(),
                task.getStatus(),
                task.getPriority(),
                task.getDueDate(),
                getUserId(task.getAssignedTo()),
                task.getCreatedBy().getId()
        );
    }

    public TaskDetailsResponse toDetailsResponse(Task task) {

        UserSummaryResponse assignedTo =
                toUserSummary(task.getAssignedTo());

        UserSummaryResponse createdBy =
                toUserSummary(task.getCreatedBy());

        return new TaskDetailsResponse(
                task.getId(),
                task.getTeam().getId(),
                task.getTitle(),
                task.getDescription(),
                task.getStatus(),
                task.getPriority(),
                task.getDueDate(),
                assignedTo,
                createdBy
        );
    }

    private UUID getUserId(User user) {
        return user != null ? user.getId() : null;
    }

    private UserSummaryResponse toUserSummary(User user) {
        if (user == null) {
            return null;
        }

        return new UserSummaryResponse(
                user.getId(),
                user.getFirstName(),
                user.getLastName()
        );
    }

    public TaskCommentResponse toCommentResponse(TaskComment comment) {

        User user = comment.getUser();

        UserSummaryResponse userResponse =
                new UserSummaryResponse(
                        user.getId(),
                        user.getFirstName(),
                        user.getLastName()
                );

        return new TaskCommentResponse(
                comment.getId(),
                comment.getTask().getId(),
                userResponse,
                comment.getContent(),
                comment.getCreatedAt(),
                comment.getUpdatedAt()
        );
    }
}