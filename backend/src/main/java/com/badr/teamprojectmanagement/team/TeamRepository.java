package com.badr.teamprojectmanagement.team;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.UUID;

public interface TeamRepository extends JpaRepository<Team, UUID> {

    List<Team> findByProjectId(UUID projectId);

    @Modifying
    @Query("""
            DELETE FROM Team t WHERE t.project.id = :projectId 
            """)
    void deleteByProjectId(@Param("projectId") UUID projectId);
}
