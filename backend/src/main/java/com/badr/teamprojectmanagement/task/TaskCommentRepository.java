
package com.badr.teamprojectmanagement.task;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.UUID;

public interface TaskCommentRepository
        extends JpaRepository<TaskComment, UUID> {

    List<TaskComment> findByTaskIdOrderByCreatedAtAsc(UUID taskId);

    List<TaskComment> findByUserId(UUID userId);

    @Modifying
    @Query("""
            DELETE FROM TaskComment tc
            WHERE tc.task.team.project.id = :projectId
            """)
    void deleteByProjectId(@Param("projectId") UUID projectId);
}

