
package com.badr.teamprojectmanagement.space;

import com.badr.teamprojectmanagement.common.enums.RequestStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface SpaceJoinRequestRepository
        extends JpaRepository<SpaceJoinRequest, UUID> {

    Optional<SpaceJoinRequest> findBySpaceIdAndUserId(
            UUID spaceId,
            UUID userId
    );

    Optional<SpaceJoinRequest> findBySpaceIdAndUserIdAndStatus(
            UUID spaceId,
            UUID userId,
            RequestStatus status
    );

    List<SpaceJoinRequest> findBySpaceIdAndStatus(
            UUID spaceId,
            RequestStatus status
    );

    List<SpaceJoinRequest> findByUserIdAndStatus(
            UUID userId,
            RequestStatus status
    );
}

