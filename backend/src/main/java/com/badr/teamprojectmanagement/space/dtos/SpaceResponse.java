package com.badr.teamprojectmanagement.space.dtos;

import java.util.UUID;

public record SpaceResponse(

        UUID id,

        String name,

        String description,

        UUID ownerId
) {
}