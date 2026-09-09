package com.badr.teamprojectmanagement.task.service;

import com.badr.teamprojectmanagement.exception.ForbiddenException;
import com.badr.teamprojectmanagement.exception.ResourceNotFoundException;
import com.badr.teamprojectmanagement.task.Task;
import com.badr.teamprojectmanagement.task.TaskRepository;
import com.badr.teamprojectmanagement.task.dtos.TaskCreateRequest;
import com.badr.teamprojectmanagement.task.dtos.TaskResponse;
import com.badr.teamprojectmanagement.task.dtos.TaskUpdateRequest;
import com.badr.teamprojectmanagement.team.Team;
import com.badr.teamprojectmanagement.team.TeamMemberRepository;
import com.badr.teamprojectmanagement.team.TeamRepository;
import com.badr.teamprojectmanagement.user.User;
import com.badr.teamprojectmanagement.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@Transactional
@RequiredArgsConstructor
public class TaskServiceImpl implements TaskService {

    private final TaskRepository taskRepository;
    private final TeamRepository teamRepository;
    private final TeamMemberRepository teamMemberRepository;
    private final UserRepository userRepository;

    @Override
    public TaskResponse createTask(
            UUID teamId,
            UUID userId,
            TaskCreateRequest request
    ) {

        Team team = findTeam(teamId);
        User creator = findUser(userId);

        checkTeamMember(teamId, userId);

        User assignedUser = null;

        if (request.assignedTo() != null) {
            assignedUser = findUser(request.assignedTo());

            checkTeamMember(
                    teamId,
                    request.assignedTo()
            );
        }

        Task task = Task.builder()
                .team(team)
                .createdBy(creator)
                .assignedTo(assignedUser)
                .title(request.title())
                .description(request.description())
                .status(request.status())
                .priority(request.priority())
                .dueDate(request.dueDate())
                .build();

        Task savedTask = taskRepository.save(task);

        return mapToResponse(savedTask);
    }

    @Override
    @Transactional(readOnly = true)
    public TaskResponse getTaskById(UUID taskId) {

        Task task = findTask(taskId);

        return mapToResponse(task);
    }

    @Override
    @Transactional(readOnly = true)
    public List<TaskResponse> getTasksByTeam(UUID teamId) {

        findTeam(teamId);

        return taskRepository.findAllByTeamId(teamId)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public TaskResponse updateTask(
            UUID taskId,
            UUID userId,
            TaskUpdateRequest request
    ) {

        Task task = findTask(taskId);

        UUID teamId = task.getTeam().getId();

        checkTeamMember(teamId, userId);

        if (request.title() != null) {
            task.setTitle(request.title());
        }

        if (request.description() != null) {
            task.setDescription(request.description());
        }

        if (request.status() != null) {
            task.setStatus(request.status());
        }

        if (request.priority() != null) {
            task.setPriority(request.priority());
        }

        if (request.dueDate() != null) {
            task.setDueDate(request.dueDate());
        }

        if (request.assignedTo() != null) {

            checkTeamMember(
                    teamId,
                    request.assignedTo()
            );

            User assignedUser = findUser(request.assignedTo());

            task.setAssignedTo(assignedUser);
        }

        Task updatedTask = taskRepository.save(task);

        return mapToResponse(updatedTask);
    }

    @Override
    public void deleteTask(
            UUID taskId,
            UUID userId
    ) {

        Task task = findTask(taskId);

        checkTeamMember(
                task.getTeam().getId(),
                userId
        );

        taskRepository.delete(task);
    }

    @Override
    public TaskResponse assignTask(
            UUID taskId,
            UUID userId,
            UUID assignedTo
    ) {

        Task task = findTask(taskId);

        UUID teamId = task.getTeam().getId();

        checkTeamMember(teamId, userId);
        checkTeamMember(teamId, assignedTo);

        User assignedUser = findUser(assignedTo);

        task.setAssignedTo(assignedUser);

        Task savedTask = taskRepository.save(task);

        return mapToResponse(savedTask);
    }

    private Task findTask(UUID taskId) {

        return taskRepository.findById(taskId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Task not found")
                );
    }

    private Team findTeam(UUID teamId) {

        return teamRepository.findById(teamId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Team not found")
                );
    }

    private User findUser(UUID userId) {

        return userRepository.findById(userId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found")
                );
    }

    private void checkTeamMember(
            UUID teamId,
            UUID userId
    ) {

        boolean isMember =
                teamMemberRepository.existsByTeamIdAndUserId(
                        teamId,
                        userId
                );

        if (!isMember) {
            throw new ForbiddenException(
                    "User is not a member of this team"
            );
        }
    }

    private TaskResponse mapToResponse(Task task) {

        UUID projectId = null;

        if (task.getTeam() != null &&
                task.getTeam().getProject() != null) {

            projectId = task.getTeam()
                    .getProject()
                    .getId();
        }

        UUID assignedTo = null;

        if (task.getAssignedTo() != null) {
            assignedTo = task.getAssignedTo().getId();
        }

        return new TaskResponse(
                task.getId(),
                task.getTitle(),
                task.getDescription(),
                task.getStatus(),
                task.getPriority(),
                task.getDueDate(),
                projectId,
                assignedTo
        );
    }
}