package com.badr.teamprojectmanagement.project.dto;

import com.badr.teamprojectmanagement.common.enums.ProjectStatus;

import java.time.LocalDate;
import java.util.UUID;

public record ProjectResponse(

        UUID id,

        String name,

        String description,

        UUID ownerId,

        ProjectStatus status,

        LocalDate startDate,

        LocalDate endDate
) {
}