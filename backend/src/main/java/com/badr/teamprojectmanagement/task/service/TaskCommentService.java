package com.badr.teamprojectmanagement.task.service;

import com.badr.teamprojectmanagement.task.dtos.TaskCommentCreateRequest;
import com.badr.teamprojectmanagement.task.dtos.TaskCommentResponse;
import com.badr.teamprojectmanagement.task.dtos.TaskCommentUpdateRequest;

import java.util.List;
import java.util.UUID;

public interface TaskCommentService {

    TaskCommentResponse createComment(
            UUID taskId,
            UUID userId,
            TaskCommentCreateRequest request
    );

    List<TaskCommentResponse> getTaskComments(
            UUID taskId,
            UUID userId
    );

    TaskCommentResponse updateComment(
            UUID commentId,
            UUID userId,
            TaskCommentUpdateRequest request
    );

    void deleteComment(
            UUID commentId,
            UUID userId
    );
}