package com.badr.teamprojectmanagement.user.dtos;

import java.util.UUID;

public record UserSummaryResponse(
        UUID id,
        String firstName,
        String lastName
) {}