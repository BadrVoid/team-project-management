package com.badr.teamprojectmanagement.team.dtos;

import java.util.UUID;

public record TeamResponse(

        UUID id,

        String name,

        String description,

        UUID ownerId
) {
}