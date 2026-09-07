package com.badr.teamprojectmanagement.project.dtos;

import java.util.UUID;

public record ProjectMemberResponse(

        UUID id,

        UUID projectId,

        UUID userId
) {
}