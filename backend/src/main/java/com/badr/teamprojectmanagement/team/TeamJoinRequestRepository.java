package com.badr.teamprojectmanagement.team;

import com.badr.teamprojectmanagement.common.enums.TeamJoinRequestStatus;
import com.badr.teamprojectmanagement.user.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface TeamJoinRequestRepository
        extends JpaRepository<TeamJoinRequest, UUID> {

    Optional<TeamJoinRequest> findByTeamIdAndUser(
            UUID teamId,
            User user
    );

    List<TeamJoinRequest> findByTeamIdAndStatus(
            UUID teamId,
            TeamJoinRequestStatus status
    );

    List<TeamJoinRequest> findByUserIdAndStatus(
            UUID userId,
            TeamJoinRequestStatus status
    );
}