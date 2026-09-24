package com.badr.teamprojectmanagement.task.service;

import com.badr.teamprojectmanagement.common.enums.*;
import com.badr.teamprojectmanagement.exception.ForbiddenException;
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
import com.badr.teamprojectmanagement.team.TeamMember;
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
@RequiredArgsConstructor
@Transactional
public class TaskServiceImpl implements TaskService {

    private final TaskRepository taskRepository;
    private final TeamRepository teamRepository;
    private final UserRepository userRepository;
    private final TaskMapper taskMapper;
    private final TeamMemberRepository teamMemberRepository;
    private final NotificationService notificationService;

    // =========================================================
    // Create
    // =========================================================

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

        // User must be an accepted member of the team.
        verifyAcceptedTeamMember(
                team.getId(),
                userId
        );

        User assignedTo = null;

        if (request.assignedToId() != null) {
            assignedTo = findAcceptedTeamMemberUser(
                    team.getId(),
                    request.assignedToId()
            );
        }

        Task task = Task.builder()
                .team(team)
                .title(request.title())
                .description(request.description())
                .priority(
                        request.priority() != null
                                ? request.priority()
                                : TaskPriority.MEDIUM
                )
                .dueDate(request.dueDate())
                .assignedTo(assignedTo)
                .createdBy(creator)
                .build();

        Task savedTask = taskRepository.save(task);

        // Notify assigned user if another user assigned the task.
        if (assignedTo != null
                && !assignedTo.getId().equals(userId)) {

            notificationService.createNotification(
                    assignedTo.getId(),
                    NotificationType.TASK_ASSIGNED,
                    "You have been assigned a new task: "
                            + savedTask.getTitle(),
                    savedTask.getId()
            );
        }

        return taskMapper.toResponse(savedTask);
    }

    // =========================================================
    // Get task
    // =========================================================

    @Override
    @Transactional(readOnly = true)
    public TaskResponse getTaskById(
            UUID id,
            UUID userId
    ) {
        Task task = findTask(id);

        verifyAcceptedTeamMember(
                task.getTeam().getId(),
                userId
        );

        return taskMapper.toResponse(task);
    }

    @Override
    public TaskResponse updateTaskStatus(
            UUID taskId,
            UUID userId,
            TaskStatus status
    ) {
        Task task = findTask(taskId);

        verifyAcceptedTeamMember(
                task.getTeam().getId(),
                userId
        );

        authorizeTaskUpdate(
                task,
                userId
        );

        task.setStatus(status);

        Task savedTask = taskRepository.save(task);

        return taskMapper.toResponse(savedTask);
    }

    // =========================================================
    // Get task details
    // =========================================================

    @Override
    @Transactional(readOnly = true)
    public TaskDetailsResponse getTaskDetails(
            UUID id,
            UUID userId
    ) {
        Task task = findTask(id);

        verifyAcceptedTeamMember(
                task.getTeam().getId(),
                userId
        );

        return taskMapper.toDetailsResponse(task);
    }

    // =========================================================
    // Get tasks by team
    // =========================================================

    @Override
    @Transactional(readOnly = true)
    public List<TaskResponse> getTasksByTeam(
            UUID teamId,
            UUID userId
    ) {
        if (!teamRepository.existsById(teamId)) {
            throw new ResourceNotFoundException("Team not found");
        }

        verifyAcceptedTeamMember(
                teamId,
                userId
        );

        return taskRepository.findByTeamId(teamId)
                .stream()
                .map(taskMapper::toResponse)
                .toList();
    }

    // =========================================================
    // Get tasks assigned to user
    // =========================================================

    @Override
    @Transactional(readOnly = true)
    public List<TaskResponse> getTasksByUser(
            UUID userId
    ) {
        if (!userRepository.existsById(userId)) {
            throw new ResourceNotFoundException("User not found");
        }

        return taskRepository.findByAssignedToId(userId)
                .stream()
                .map(taskMapper::toResponse)
                .toList();
    }

    // =========================================================
    // Update
    // =========================================================

    @Override
    public TaskResponse updateTask(
            UUID id,
            UUID userId,
            TaskUpdateRequest request
    ) {
        Task task = findTask(id);

        verifyAcceptedTeamMember(
                task.getTeam().getId(),
                userId
        );

        authorizeTaskUpdate(
                task,
                userId
        );

        User oldAssignedTo = task.getAssignedTo();

        User assignedTo = null;

        if (request.assignedToId() != null) {
            assignedTo = findAcceptedTeamMemberUser(
                    task.getTeam().getId(),
                    request.assignedToId()
            );
        }

        task.setTitle(request.title());
        task.setDescription(request.description());
        task.setStatus(request.status());
        task.setPriority(request.priority());
        task.setDueDate(request.dueDate());
        task.setAssignedTo(assignedTo);

        boolean assignmentChanged =
                oldAssignedTo == null
                        ? assignedTo != null
                        : assignedTo == null
                        || !oldAssignedTo.getId()
                        .equals(assignedTo.getId());

        // =====================================================
        // Assignment notifications
        // =====================================================

        if (assignmentChanged) {

            // New assignee
            if (assignedTo != null
                    && !assignedTo.getId().equals(userId)) {

                notificationService.createNotification(
                        assignedTo.getId(),
                        NotificationType.TASK_ASSIGNED,
                        "You have been assigned a task: "
                                + task.getTitle(),
                        task.getId()
                );
            }

            // Previous assignee
            if (oldAssignedTo != null
                    && !oldAssignedTo.getId().equals(userId)
                    && (
                    assignedTo == null
                            || !oldAssignedTo.getId()
                            .equals(assignedTo.getId())
            )) {

                notificationService.createNotification(
                        oldAssignedTo.getId(),
                        NotificationType.TASK_UPDATED,
                        "Your assignment on the task was changed: "
                                + task.getTitle(),
                        task.getId()
                );
            }

        } else if (
                assignedTo != null
                        && !assignedTo.getId().equals(userId)
        ) {

            // Task changed but assignment stayed the same.
            notificationService.createNotification(
                    assignedTo.getId(),
                    NotificationType.TASK_UPDATED,
                    "Your assigned task was updated: "
                            + task.getTitle(),
                    task.getId()
            );
        }

        return taskMapper.toResponse(task);
    }

    // =========================================================
    // Delete
    // =========================================================

    @Override
    public void deleteTask(
            UUID id,
            UUID userId
    ) {
        Task task = findTask(id);

        verifyAcceptedTeamMember(
                task.getTeam().getId(),
                userId
        );

        authorizeTaskManagement(
                task,
                userId
        );

        taskRepository.delete(task);
    }

    // =========================================================
    // Find task
    // =========================================================

    private Task findTask(UUID id) {
        return taskRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Task not found"
                        ));
    }

    // =========================================================
    // Verify accepted team member
    // =========================================================

    private void verifyAcceptedTeamMember(
            UUID teamId,
            UUID userId
    ) {
        TeamMember member = teamMemberRepository
                .findByTeamIdAndUserId(
                        teamId,
                        userId
                )
                .orElseThrow(() ->
                        new ForbiddenException(
                                "You are not a member of this team"
                        )
                );

        if (member.getStatus() != RequestStatus.ACCEPTED) {
            throw new ForbiddenException(
                    "You must be an accepted team member"
            );
        }
    }

    // =========================================================
    // Find accepted team member user
    // =========================================================

    private User findAcceptedTeamMemberUser(
            UUID teamId,
            UUID userId
    ) {
        TeamMember member = teamMemberRepository
                .findByTeamIdAndUserId(
                        teamId,
                        userId
                )
                .orElseThrow(() ->
                        new ForbiddenException(
                                "Assigned user is not a member of this team"
                        )
                );

        if (member.getStatus() != RequestStatus.ACCEPTED) {
            throw new ForbiddenException(
                    "Assigned user must be an accepted team member"
            );
        }

        return member.getUser();
    }

    // =========================================================
    // Update authorization
    // =========================================================

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

        if (!isCreator
                && !isAssignedUser
                && !isTeamLeader) {

            throw new ForbiddenException(
                    "You are not allowed to update this task"
            );
        }
    }

    // =========================================================
    // Delete authorization
    // =========================================================

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
            throw new ForbiddenException(
                    "You are not allowed to delete this task"
            );
        }
    }

    // =========================================================
    // Team leader check
    // =========================================================

    private boolean isTeamLeader(
            UUID teamId,
            UUID userId
    ) {
        return teamMemberRepository
                .findByTeamIdAndUserId(
                        teamId,
                        userId
                )
                .map(member ->
                        member.getStatus() == RequestStatus.ACCEPTED
                                && member.getRole() == TeamMemberRole.LEADER
                )
                .orElse(false);
    }
}