package com.badr.teamprojectmanagement.task;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface TaskRepository extends JpaRepository<Task, UUID> {

    List<Task> findAllByTeamId(UUID teamId);

    List<Task> findAllByAssignedToId(UUID userId);
}