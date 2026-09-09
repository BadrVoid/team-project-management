package com.badr.teamprojectmanagement.task.service;

import com.badr.teamprojectmanagement.task.dtos.CommentCreateRequest;
import com.badr.teamprojectmanagement.task.dtos.CommentResponse;
import com.badr.teamprojectmanagement.task.dtos.CommentUpdateRequest;

import java.util.List;
import java.util.UUID;

public interface TaskCommentService {

    CommentResponse createComment(
            UUID taskId,
            UUID userId,
            CommentCreateRequest request
    );

    CommentResponse getCommentById(UUID commentId);

    List<CommentResponse> getCommentsByTask(UUID taskId);

    CommentResponse updateComment(
            UUID commentId,
            UUID userId,
            CommentUpdateRequest request
    );

    void deleteComment(
            UUID commentId,
            UUID userId
    );
}