package com.badr.teamprojectmanagement.space;

import com.badr.teamprojectmanagement.common.enums.SpaceRequestStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface SpaceJoinRequestRepository
        extends JpaRepository<SpaceJoinRequest, UUID> {

    Optional<SpaceJoinRequest> findBySpaceIdAndUserId(
            UUID spaceId,
            UUID userId
    );

    boolean existsBySpaceIdAndUserIdAndStatus(
            UUID spaceId,
            UUID userId,
            SpaceRequestStatus status
    );
}
