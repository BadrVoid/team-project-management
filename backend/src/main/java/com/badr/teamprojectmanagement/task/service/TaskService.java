package com.badr.teamprojectmanagement.task.service;

import com.badr.teamprojectmanagement.task.dtos.TaskCreateRequest;
import com.badr.teamprojectmanagement.task.dtos.TaskResponse;
import com.badr.teamprojectmanagement.task.dtos.TaskUpdateRequest;

import java.util.List;
import java.util.UUID;

public interface TaskService {

    TaskResponse createTask(
            UUID teamId,
            UUID userId,
            TaskCreateRequest request
    );

    TaskResponse getTaskById(UUID taskId);

    List<TaskResponse> getTasksByTeam(UUID teamId);

    TaskResponse updateTask(
            UUID taskId,
            UUID userId,
            TaskUpdateRequest request
    );

    void deleteTask(
            UUID taskId,
            UUID userId
    );

    TaskResponse assignTask(
            UUID taskId,
            UUID userId,
            UUID assignedTo
    );
}