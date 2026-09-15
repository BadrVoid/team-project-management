package com.badr.teamprojectmanagement.team.dtos;

import java.util.UUID;

public record TeamSummaryResponse(
        UUID id,
        String name,
        String description
) {}