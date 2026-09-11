package com.badr.teamprojectmanagement.task.controller;

import com.badr.teamprojectmanagement.common.response.GlobalResponse;
import com.badr.teamprojectmanagement.task.dtos.TaskCommentCreateRequest;
import com.badr.teamprojectmanagement.task.dtos.TaskCommentResponse;
import com.badr.teamprojectmanagement.task.dtos.TaskCommentUpdateRequest;
import com.badr.teamprojectmanagement.task.service.TaskCommentService;
import com.badr.teamprojectmanagement.user.User;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/tasks/{taskId}/comments")
@RequiredArgsConstructor
public class TaskCommentController {

    private final TaskCommentService taskCommentService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public GlobalResponse<TaskCommentResponse> createComment(
            @PathVariable UUID taskId,
            @AuthenticationPrincipal User user,
            @Valid @RequestBody TaskCommentCreateRequest request
    ) {

        TaskCommentResponse response =
                taskCommentService.createComment(
                        taskId,
                        user.getId(),
                        request
                );

        return GlobalResponse.success(
                "Comment created successfully",
                response
        );
    }

    @GetMapping
    public GlobalResponse<List<TaskCommentResponse>> getTaskComments(
            @PathVariable UUID taskId,
            @AuthenticationPrincipal User user
    ) {

        List<TaskCommentResponse> response =
                taskCommentService.getTaskComments(
                        taskId,
                        user.getId()
                );

        return GlobalResponse.success(
                "Task comments retrieved successfully",
                response
        );
    }

    @PutMapping("/{commentId}")
    public GlobalResponse<TaskCommentResponse> updateComment(
            @PathVariable UUID taskId,
            @PathVariable UUID commentId,
            @AuthenticationPrincipal User user,
            @Valid @RequestBody TaskCommentUpdateRequest request
    ) {

        TaskCommentResponse response =
                taskCommentService.updateComment(
                        commentId,
                        user.getId(),
                        request
                );

        return GlobalResponse.success(
                "Comment updated successfully",
                response
        );
    }

    @DeleteMapping("/{commentId}")
    public GlobalResponse<Void> deleteComment(
            @PathVariable UUID taskId,
            @PathVariable UUID commentId,
            @AuthenticationPrincipal User user
    ) {

        taskCommentService.deleteComment(
                commentId,
                user.getId()
        );

        return GlobalResponse.success(
                "Comment deleted successfully",
                null
        );
    }
}