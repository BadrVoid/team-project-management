package com.badr.teamprojectmanagement.team.dtos;

import java.util.UUID;

public record TeamResponse(
        UUID id,
        UUID projectId,
        String name,
        String description
) {}