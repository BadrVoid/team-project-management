package com.badr.teamprojectmanagement.team;

import com.badr.teamprojectmanagement.user.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface TeamMemberRepository
        extends JpaRepository<TeamMember, UUID> {

    List<TeamMember> findByTeamId(UUID teamId);

    Optional<TeamMember> findByTeamIdAndUser(
            UUID teamId,
            User user
    );

    boolean existsByTeamIdAndUser(
            UUID teamId,
            User user
    );

    boolean existsByTeamIdAndUserId(
            UUID teamId,
            UUID userId
    );
}