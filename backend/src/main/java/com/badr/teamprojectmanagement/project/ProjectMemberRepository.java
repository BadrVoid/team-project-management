package com.badr.teamprojectmanagement.project;

import com.badr.teamprojectmanagement.common.enums.RequestStatus;
import com.badr.teamprojectmanagement.user.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ProjectMemberRepository
        extends JpaRepository<ProjectMember, UUID> {

    List<ProjectMember> findByProjectId(UUID projectId);

    Optional<ProjectMember> findByProjectIdAndUser(
            UUID projectId,
            User user
    );

    @Modifying
    @Query("DELETE FROM ProjectMember pm WHERE pm.project.id = :projectId")
    void deleteByProjectId(@Param("projectId") UUID projectId);

    boolean existsByProjectIdAndUser(
            UUID projectId,
            User user
    );

    List<ProjectMember> findByUserAndStatus(
            User user,
            RequestStatus status
    );

    Optional<ProjectMember> findByProjectIdAndUserAndStatus(
            UUID projectId,
            User user,
            RequestStatus status
    );

    List<ProjectMember> findByProject(Project project);

    Optional<ProjectMember> findByProjectIdAndUserId(
            UUID projectId,
            UUID userId
    );
}
