
package com.badr.teamprojectmanagement.task;

import com.badr.teamprojectmanagement.common.enums.TaskStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.UUID;

public interface TaskRepository extends JpaRepository<Task, UUID> {

    List<Task> findByTeamId(UUID teamId);

    List<Task> findByAssignedToId(UUID userId);

    List<Task> findByTeamIdAndStatus(
            UUID teamId,
            TaskStatus status
    );

    @Modifying
    @Query("""
            DELETE FROM Task t
            WHERE t.team.project.id = :projectId
            """)
    void deleteByProjectId(@Param("projectId") UUID projectId);
}

