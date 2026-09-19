package com.badr.teamprojectmanagement.space;

import com.badr.teamprojectmanagement.common.enums.Visibility;
import com.badr.teamprojectmanagement.user.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Collection;
import java.util.List;
import java.util.UUID;

public interface SpaceRepository
        extends JpaRepository<Space, UUID> {

    List<Space> findByOwner(User owner);

    List<Space> findByVisibility(Visibility visibility);

    boolean existsByOwnerIdAndNameIgnoreCase(
            UUID ownerId,
            String name
    );
}
