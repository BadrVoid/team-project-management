package com.badr.teamprojectmanagement.space;

import com.badr.teamprojectmanagement.user.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface SpaceMemberRepository
        extends JpaRepository<SpaceMember, UUID> {

    boolean existsBySpaceIdAndUserId(
            UUID spaceId,
            UUID userId
    );

    boolean existsBySpaceIdAndUserIdAndRole(
            UUID spaceId,
            UUID userId,
            com.badr.teamprojectmanagement.common.enums.SpaceMemberRole role
    );

    boolean existsBySpaceAndUser(
            Space space,
            User user
    );
}