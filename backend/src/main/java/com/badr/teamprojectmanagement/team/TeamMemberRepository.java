package com.badr.teamprojectmanagement.team;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface TeamMemberRepository extends JpaRepository<TeamMember, UUID> {

    Optional<TeamMember> findByTeamIdAndUserId(UUID teamId, UUID userId);

    boolean existsByTeamIdAndUserId(UUID teamId, UUID userId);

    List<TeamMember> findAllByTeamId(UUID teamId);

    List<TeamMember> findAllByUserId(UUID userId);
}