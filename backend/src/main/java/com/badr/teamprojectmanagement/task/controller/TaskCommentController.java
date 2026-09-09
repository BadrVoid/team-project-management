package com.badr.teamprojectmanagement.task.controller;

import com.badr.teamprojectmanagement.common.response.GlobalResponse;
import com.badr.teamprojectmanagement.task.dtos.CommentCreateRequest;
import com.badr.teamprojectmanagement.task.dtos.CommentResponse;
import com.badr.teamprojectmanagement.task.dtos.CommentUpdateRequest;
import com.badr.teamprojectmanagement.task.service.TaskCommentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/tasks/{taskId}/comments")
@RequiredArgsConstructor
public class TaskCommentController {

    private final TaskCommentService taskCommentService;

    @PostMapping
    public ResponseEntity<GlobalResponse<CommentResponse>> createComment(
            @PathVariable UUID taskId,
            @RequestParam UUID userId,
            @Valid @RequestBody CommentCreateRequest request
    ) {

        CommentResponse response =
                taskCommentService.createComment(
                        taskId,
                        userId,
                        request
                );

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(
                        GlobalResponse.success(
                                "Comment created successfully",
                                response
                        )
                );
    }

    @GetMapping
    public ResponseEntity<GlobalResponse<List<CommentResponse>>> getComments(
            @PathVariable UUID taskId
    ) {

        List<CommentResponse> response =
                taskCommentService.getCommentsByTask(taskId);

        return ResponseEntity.ok(
                GlobalResponse.success(
                        "Comments retrieved successfully",
                        response
                )
        );
    }

    @GetMapping("/{commentId}")
    public ResponseEntity<GlobalResponse<CommentResponse>> getCommentById(
            @PathVariable UUID commentId
    ) {

        CommentResponse response =
                taskCommentService.getCommentById(commentId);

        return ResponseEntity.ok(
                GlobalResponse.success(
                        "Comment retrieved successfully",
                        response
                )
        );
    }

    @PutMapping("/{commentId}")
    public ResponseEntity<GlobalResponse<CommentResponse>> updateComment(
            @PathVariable UUID commentId,
            @RequestParam UUID userId,
            @Valid @RequestBody CommentUpdateRequest request
    ) {

        CommentResponse response =
                taskCommentService.updateComment(
                        commentId,
                        userId,
                        request
                );

        return ResponseEntity.ok(
                GlobalResponse.success(
                        "Comment updated successfully",
                        response
                )
        );
    }

    @DeleteMapping("/{commentId}")
    public ResponseEntity<GlobalResponse<Void>> deleteComment(
            @PathVariable UUID commentId,
            @RequestParam UUID userId
    ) {

        taskCommentService.deleteComment(
                commentId,
                userId
        );

        return ResponseEntity.ok(
                GlobalResponse.success(
                        "Comment deleted successfully",
                        null
                )
        );
    }
}