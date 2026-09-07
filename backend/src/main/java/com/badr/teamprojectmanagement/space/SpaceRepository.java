package com.badr.teamprojectmanagement.space;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface SpaceRepository extends JpaRepository<Space, UUID> {
}