package com.badr.teamprojectmanagement.space.dtos;

import com.badr.teamprojectmanagement.common.enums.Visibility;

import java.util.UUID;

public record SpaceResponse(

        UUID id,

        String name,

        String description,

        Visibility visibility,

        UUID ownerId
) {
}
