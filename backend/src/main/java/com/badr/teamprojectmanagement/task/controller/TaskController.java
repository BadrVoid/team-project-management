package com.badr.teamprojectmanagement.task.controller;

import com.badr.teamprojectmanagement.common.enums.TaskStatus;
import com.badr.teamprojectmanagement.common.response.GlobalResponse;
import com.badr.teamprojectmanagement.task.dtos.TaskCreateRequest;
import com.badr.teamprojectmanagement.task.dtos.TaskDetailsResponse;
import com.badr.teamprojectmanagement.task.dtos.TaskResponse;
import com.badr.teamprojectmanagement.task.dtos.TaskUpdateRequest;
import com.badr.teamprojectmanagement.task.service.TaskService;
import com.badr.teamprojectmanagement.user.User;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/tasks")
@RequiredArgsConstructor
public class TaskController {

    private final TaskService taskService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public GlobalResponse<TaskResponse> createTask(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody TaskCreateRequest request
    ) {
        TaskResponse response =
                taskService.createTask(
                        user.getId(),
                        request
                );

        return GlobalResponse.success(
                "Task created successfully",
                response
        );
    }

    @GetMapping("/{id}")
    public GlobalResponse<TaskResponse> getTaskById(
            @PathVariable UUID id,
            @AuthenticationPrincipal User user
    ) {
        TaskResponse response =
                taskService.getTaskById(
                        id,
                        user.getId()
                );

        return GlobalResponse.success(
                "Task retrieved successfully",
                response
        );
    }

    @GetMapping("/{id}/details")
    public GlobalResponse<TaskDetailsResponse> getTaskDetails(
            @PathVariable UUID id,
            @AuthenticationPrincipal User user
    ) {
        TaskDetailsResponse response =
                taskService.getTaskDetails(
                        id,
                        user.getId()
                );

        return GlobalResponse.success(
                "Task details retrieved successfully",
                response
        );
    }

    @GetMapping("/team/{teamId}")
    public GlobalResponse<List<TaskResponse>> getTasksByTeam(
            @PathVariable UUID teamId,
            @AuthenticationPrincipal User user
    ) {
        List<TaskResponse> response =
                taskService.getTasksByTeam(
                        teamId,
                        user.getId()
                );

        return GlobalResponse.success(
                "Team tasks retrieved successfully",
                response
        );
    }

    @GetMapping("/my")
    public GlobalResponse<List<TaskResponse>> getMyTasks(
            @AuthenticationPrincipal User user
    ) {
        List<TaskResponse> response =
                taskService.getTasksByUser(user.getId());

        return GlobalResponse.success(
                "My tasks retrieved successfully",
                response
        );
    }

    @PutMapping("/{id}")
    public GlobalResponse<TaskResponse> updateTask(
            @PathVariable UUID id,
            @AuthenticationPrincipal User user,
            @Valid @RequestBody TaskUpdateRequest request
    ) {
        TaskResponse response =
                taskService.updateTask(
                        id,
                        user.getId(),
                        request
                );

        return GlobalResponse.success(
                "Task updated successfully",
                response
        );
    }

    @DeleteMapping("/{id}")
    public GlobalResponse<Void> deleteTask(
            @PathVariable UUID id,
            @AuthenticationPrincipal User user
    ) {
        taskService.deleteTask(
                id,
                user.getId()
        );

        return GlobalResponse.success(
                "Task deleted successfully",
                null
        );
    }

    @PatchMapping("/{id}/status")
    public GlobalResponse<TaskResponse> updateTaskStatus(
            @PathVariable UUID id,
            @AuthenticationPrincipal User user,
            @RequestParam TaskStatus status
    ) {
        TaskResponse response =
                taskService.updateTaskStatus(
                        id,
                        user.getId(),
                        status
                );

        return GlobalResponse.success(
                "Task status updated successfully",
                response
        );
    }
}