package com.badr.teamprojectmanagement.project;

import com.badr.teamprojectmanagement.space.Space;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface ProjectRepository extends JpaRepository<Project, UUID> {

    List<Project> findBySpace(Space space);
}