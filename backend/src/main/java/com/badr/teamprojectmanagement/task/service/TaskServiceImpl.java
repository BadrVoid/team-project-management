package com.badr.teamprojectmanagement.task.service;

import com.badr.teamprojectmanagement.common.enums.NotificationType;
import com.badr.teamprojectmanagement.common.enums.TeamMemberRole;
import com.badr.teamprojectmanagement.exception.ResourceNotFoundException;
import com.badr.teamprojectmanagement.notification.service.NotificationService;
import com.badr.teamprojectmanagement.task.Task;
import com.badr.teamprojectmanagement.task.TaskMapper;
import com.badr.teamprojectmanagement.task.TaskRepository;
import com.badr.teamprojectmanagement.task.dtos.TaskCreateRequest;
import com.badr.teamprojectmanagement.task.dtos.TaskDetailsResponse;
import com.badr.teamprojectmanagement.task.dtos.TaskResponse;
import com.badr.teamprojectmanagement.task.dtos.TaskUpdateRequest;
import com.badr.teamprojectmanagement.team.Team;
import com.badr.teamprojectmanagement.team.TeamMemberRepository;
import com.badr.teamprojectmanagement.team.TeamRepository;
import com.badr.teamprojectmanagement.user.User;
import com.badr.teamprojectmanagement.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class TaskServiceImpl implements TaskService {

    private final TaskRepository taskRepository;
    private final TeamRepository teamRepository;
    private final UserRepository userRepository;
    private final TaskMapper taskMapper;
    private final TeamMemberRepository teamMemberRepository;
    private final NotificationService notificationService;

    @Override
    public TaskResponse createTask(
            UUID userId,
            TaskCreateRequest request
    ) {

        Team team = teamRepository.findById(request.teamId())
                .orElseThrow(() ->
                        new ResourceNotFoundException("Team not found"));

        User creator = userRepository.findById(userId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found"));

        // Creator must be a team member
        if (!teamMemberRepository.existsByTeamIdAndUserId(
                team.getId(),
                userId
        )) {
            throw new AccessDeniedException(
                    "You must be a team member to create a task"
            );
        }

        User assignedTo = null;

        if (request.assignedToId() != null) {

            assignedTo = userRepository.findById(
                    request.assignedToId()
            ).orElseThrow(() ->
                    new ResourceNotFoundException(
                            "Assigned user not found"
                    ));

            // Assigned user must be a member of the same team
            if (!teamMemberRepository.existsByTeamIdAndUserId(
                    team.getId(),
                    request.assignedToId()
            )) {
                throw new AccessDeniedException(
                        "Assigned user must be a member of the team"
                );
            }
        }

        Task task = Task.builder()
                .team(team)
                .title(request.title())
                .description(request.description())
                .priority(request.priority())
                .dueDate(request.dueDate())
                .assignedTo(assignedTo)
                .createdBy(creator)
                .build();

        Task savedTask = taskRepository.save(task);

        // Notify assigned user
        if (assignedTo != null) {
            notificationService.createNotification(
                    assignedTo.getId(),
                    NotificationType.TASK_ASSIGNED,
                    "You have been assigned a new task: "
                            + savedTask.getTitle()
            );
        }

        return taskMapper.toResponse(savedTask);
    }

    @Override
    @Transactional(readOnly = true)
    public TaskResponse getTaskById(UUID id) {
        Task task = findTask(id);
        return taskMapper.toResponse(task);
    }

    @Override
    @Transactional(readOnly = true)
    public TaskDetailsResponse getTaskDetails(UUID id) {
        Task task = findTask(id);
        return taskMapper.toDetailsResponse(task);
    }

    @Override
    @Transactional(readOnly = true)
    public List<TaskResponse> getTasksByTeam(UUID teamId) {

        if (!teamRepository.existsById(teamId)) {
            throw new ResourceNotFoundException("Team not found");
        }

        return taskRepository.findByTeamId(teamId)
                .stream()
                .map(taskMapper::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<TaskResponse> getTasksByUser(UUID userId) {

        if (!userRepository.existsById(userId)) {
            throw new ResourceNotFoundException("User not found");
        }

        return taskRepository.findByAssignedToId(userId)
                .stream()
                .map(taskMapper::toResponse)
                .toList();
    }

    @Override
    public TaskResponse updateTask(
            UUID id,
            UUID userId,
            TaskUpdateRequest request
    ) {

        Task task = findTask(id);

        authorizeTaskUpdate(task, userId);

        User assignedTo = null;

        if (request.assignedToId() != null) {

            assignedTo = userRepository.findById(
                    request.assignedToId()
            ).orElseThrow(() ->
                    new ResourceNotFoundException(
                            "Assigned user not found"
                    ));

            // Assigned user must belong to the same team
            if (!teamMemberRepository.existsByTeamIdAndUserId(
                    task.getTeam().getId(),
                    request.assignedToId()
            )) {
                throw new AccessDeniedException(
                        "Assigned user must be a member of the team"
                );
            }
        }
        User oldAssignedTo = task.getAssignedTo();
        task.setTitle(request.title());
        task.setDescription(request.description());
        task.setStatus(request.status());
        task.setPriority(request.priority());
        task.setDueDate(request.dueDate());
        task.setAssignedTo(assignedTo);
        if (assignedTo != null) {

            boolean assigneeChanged =
                    oldAssignedTo == null
                            || !oldAssignedTo.getId().equals(assignedTo.getId());

            if (assigneeChanged) {

                notificationService.createNotification(
                        assignedTo.getId(),
                        NotificationType.TASK_ASSIGNED,
                        "You have been assigned a task: "
                                + task.getTitle()
                );

            } else if (!assignedTo.getId().equals(userId)) {

                notificationService.createNotification(
                        assignedTo.getId(),
                        NotificationType.TASK_UPDATED,
                        "Your assigned task was updated: "
                                + task.getTitle()
                );
            }
        }
        return taskMapper.toResponse(task);
    }

    @Override
    public void deleteTask(UUID id, UUID userId) {

        Task task = findTask(id);

        authorizeTaskManagement(task, userId);

        taskRepository.delete(task);
    }

    private Task findTask(UUID id) {

        return taskRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Task not found"));
    }

    private void authorizeTaskUpdate(
            Task task,
            UUID userId
    ) {

        boolean isCreator =
                task.getCreatedBy()
                        .getId()
                        .equals(userId);

        boolean isAssignedUser =
                task.getAssignedTo() != null
                        && task.getAssignedTo()
                        .getId()
                        .equals(userId);

        boolean isTeamLeader =
                isTeamLeader(
                        task.getTeam().getId(),
                        userId
                );

        if (!isCreator && !isAssignedUser && !isTeamLeader) {
            throw new AccessDeniedException(
                    "You are not allowed to update this task"
            );
        }
    }

    private void authorizeTaskManagement(
            Task task,
            UUID userId
    ) {

        boolean isCreator =
                task.getCreatedBy()
                        .getId()
                        .equals(userId);

        boolean isTeamLeader =
                isTeamLeader(
                        task.getTeam().getId(),
                        userId
                );

        if (!isCreator && !isTeamLeader) {
            throw new AccessDeniedException(
                    "You are not allowed to manage this task"
            );
        }
    }

    private boolean isTeamLeader(
            UUID teamId,
            UUID userId
    ) {

        return teamMemberRepository
                .findByTeamIdAndUserId(teamId, userId)
                .map(member ->
                        member.getRole() == TeamMemberRole.LEADER
                )
                .orElse(false);
    }
}