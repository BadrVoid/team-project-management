package com.badr.teamprojectmanagement.task.service;

import com.badr.teamprojectmanagement.task.dtos.TaskCreateRequest;
import com.badr.teamprojectmanagement.task.dtos.TaskDetailsResponse;
import com.badr.teamprojectmanagement.task.dtos.TaskResponse;
import com.badr.teamprojectmanagement.task.dtos.TaskUpdateRequest;

import java.nio.file.AccessDeniedException;
import java.util.List;
import java.util.UUID;

public interface TaskService {

    TaskResponse createTask(
            UUID userId,
            TaskCreateRequest request
    );

    TaskResponse getTaskById(UUID id);

    TaskDetailsResponse getTaskDetails(UUID id);

    List<TaskResponse> getTasksByTeam(UUID teamId);

    List<TaskResponse> getTasksByUser(UUID userId);

    TaskResponse updateTask(
            UUID taskId,
            UUID userId,
            TaskUpdateRequest request
    );

    void deleteTask(
            UUID taskId,
            UUID userId
    );
}