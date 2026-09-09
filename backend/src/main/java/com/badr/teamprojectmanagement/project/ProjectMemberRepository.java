package com.badr.teamprojectmanagement.project;

import com.badr.teamprojectmanagement.common.enums.MembershipStatus;
import com.badr.teamprojectmanagement.user.User;
import org.springframework.data.jpa.repository.JpaRepository;

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

    boolean existsByProjectIdAndUser(
            UUID projectId,
            User user
    );

    List<ProjectMember> findByUserAndStatus(
            User user,
            MembershipStatus status
    );

    Optional<ProjectMember> findByProjectIdAndUserAndStatus(
            UUID projectId,
            User user,
            MembershipStatus status
    );
}