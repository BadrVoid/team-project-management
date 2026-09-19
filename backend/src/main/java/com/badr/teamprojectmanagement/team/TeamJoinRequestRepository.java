package com.badr.teamprojectmanagement.team;

import com.badr.teamprojectmanagement.common.enums.RequestStatus;
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
            RequestStatus status
    );

    List<TeamJoinRequest> findByUserIdAndStatus(
            UUID userId,
            RequestStatus status
    );
}
