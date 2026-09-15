package com.badr.teamprojectmanagement.project.dtos;

import com.badr.teamprojectmanagement.common.enums.ProjectStatus;
import com.badr.teamprojectmanagement.space.Space;

import java.time.LocalDate;
import java.util.UUID;

public record ProjectResponse(
        UUID id,
        UUID spaceId,
        String name,
        String description,
        ProjectStatus status,
        LocalDate startDate,
        LocalDate endDate,
        UUID createdBy
) {}