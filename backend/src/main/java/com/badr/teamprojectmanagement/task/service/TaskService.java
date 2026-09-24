package com.badr.teamprojectmanagement.task.service;

import com.badr.teamprojectmanagement.common.enums.TaskStatus;
import com.badr.teamprojectmanagement.task.dtos.TaskCreateRequest;
import com.badr.teamprojectmanagement.task.dtos.TaskDetailsResponse;
import com.badr.teamprojectmanagement.task.dtos.TaskResponse;
import com.badr.teamprojectmanagement.task.dtos.TaskUpdateRequest;

import java.util.List;
import java.util.UUID;

public interface TaskService {

    TaskResponse createTask(
            UUID userId,
            TaskCreateRequest request
    );

    TaskResponse getTaskById(
            UUID taskId,
            UUID userId
    );

    TaskDetailsResponse getTaskDetails(
            UUID taskId,
            UUID userId
    );

    List<TaskResponse> getTasksByTeam(
            UUID teamId,
            UUID userId
    );

    List<TaskResponse> getTasksByUser(
            UUID userId
    );

    TaskResponse updateTask(
            UUID taskId,
            UUID userId,
            TaskUpdateRequest request
    );
    TaskResponse updateTaskStatus(
            UUID taskId,
            UUID userId,
            TaskStatus taskStatus
    );
    void deleteTask(
            UUID taskId,
            UUID userId
    );
}