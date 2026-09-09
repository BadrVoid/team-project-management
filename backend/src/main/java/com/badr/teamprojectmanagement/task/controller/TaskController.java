package com.badr.teamprojectmanagement.task.controller;

import com.badr.teamprojectmanagement.common.response.GlobalResponse;
import com.badr.teamprojectmanagement.task.dtos.TaskCreateRequest;
import com.badr.teamprojectmanagement.task.dtos.TaskResponse;
import com.badr.teamprojectmanagement.task.dtos.TaskUpdateRequest;
import com.badr.teamprojectmanagement.task.service.TaskService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/teams/{teamId}/tasks")
@RequiredArgsConstructor
public class TaskController {

    private final TaskService taskService;

    @PostMapping
    public ResponseEntity<GlobalResponse<TaskResponse>> createTask(
            @PathVariable UUID teamId,
            @RequestParam UUID userId,
            @Valid @RequestBody TaskCreateRequest request
    ) {

        TaskResponse response =
                taskService.createTask(
                        teamId,
                        userId,
                        request
                );

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(GlobalResponse.success(
                        "Task created successfully",
                        response
                ));
    }

    @GetMapping
    public ResponseEntity<GlobalResponse<List<TaskResponse>>> getTasksByTeam(
            @PathVariable UUID teamId
    ) {

        List<TaskResponse> response =
                taskService.getTasksByTeam(teamId);

        return ResponseEntity.ok(
                GlobalResponse.success(
                        "Tasks retrieved successfully",
                        response
                )
        );
    }

    @GetMapping("/{taskId}")
    public ResponseEntity<GlobalResponse<TaskResponse>> getTaskById(
            @PathVariable UUID taskId
    ) {

        TaskResponse response =
                taskService.getTaskById(taskId);

        return ResponseEntity.ok(
                GlobalResponse.success(
                        "Task retrieved successfully",
                        response
                )
        );
    }

    @PutMapping("/{taskId}")
    public ResponseEntity<GlobalResponse<TaskResponse>> updateTask(
            @PathVariable UUID taskId,
            @RequestParam UUID userId,
            @Valid @RequestBody TaskUpdateRequest request
    ) {

        TaskResponse response =
                taskService.updateTask(
                        taskId,
                        userId,
                        request
                );

        return ResponseEntity.ok(
                GlobalResponse.success(
                        "Task updated successfully",
                        response
                )
        );
    }

    @DeleteMapping("/{taskId}")
    public ResponseEntity<GlobalResponse<Void>> deleteTask(
            @PathVariable UUID taskId,
            @RequestParam UUID userId
    ) {

        taskService.deleteTask(
                taskId,
                userId
        );

        return ResponseEntity.ok(
                GlobalResponse.success(
                        "Task deleted successfully",
                        null
                )
        );
    }

    @PatchMapping("/{taskId}/assign")
    public ResponseEntity<GlobalResponse<TaskResponse>> assignTask(
            @PathVariable UUID taskId,
            @RequestParam UUID userId,
            @RequestParam UUID assignedTo
    ) {

        TaskResponse response =
                taskService.assignTask(
                        taskId,
                        userId,
                        assignedTo
                );

        return ResponseEntity.ok(
                GlobalResponse.success(
                        "Task assigned successfully",
                        response
                )
        );
    }
}