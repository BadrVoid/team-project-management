package com.badr.teamprojectmanagement.project;

import com.badr.teamprojectmanagement.common.enums.RequestStatus;
import com.badr.teamprojectmanagement.user.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ProjectJoinRequestRepository
        extends JpaRepository<ProjectJoinRequest, UUID> {

    Optional<ProjectJoinRequest> findByProjectIdAndUser(
            UUID projectId,
            User user
    );

    List<ProjectJoinRequest> findByProjectIdAndStatus(
            UUID projectId,
            RequestStatus status
    );

    List<ProjectJoinRequest> findByUserAndStatus(
            User user,
            RequestStatus status
    );

    List<ProjectJoinRequest> findByUserIdAndStatus(
            UUID userId,
            RequestStatus status
    );
}
