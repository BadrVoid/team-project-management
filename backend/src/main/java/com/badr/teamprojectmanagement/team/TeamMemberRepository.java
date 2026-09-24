package com.badr.teamprojectmanagement.team;

import com.badr.teamprojectmanagement.common.enums.RequestStatus;
import com.badr.teamprojectmanagement.user.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface TeamMemberRepository
        extends JpaRepository<TeamMember, UUID> {

    List<TeamMember> findByTeamId(UUID teamId);

    List<TeamMember> findByTeamIdAndStatus(
            UUID teamId,
            RequestStatus status
    );

    Optional<TeamMember> findByTeamIdAndUser(
            UUID teamId,
            User user
    );

    Optional<TeamMember> findByTeamIdAndUserId(
            UUID teamId,
            UUID userId
    );

    Optional<TeamMember> findByTeamIdAndUserIdAndStatus(
            UUID teamId,
            UUID userId,
            RequestStatus status
    );

    boolean existsByTeamIdAndUser(
            UUID teamId,
            User user
    );

    @Modifying
    @Query("""
            DELETE FROM TeamMember tm WHERE tm.team.id IN ( SELECT t.id FROM Team t WHERE t.project.id = :projectId ) """)
    void deleteByProjectId(@Param("projectId") UUID projectId);

    boolean existsByTeamIdAndUserId(
            UUID teamId,
            UUID userId
    );

    boolean existsByTeamIdAndUserIdAndStatus(
            UUID teamId,
            UUID userId,
            RequestStatus status
    );
}