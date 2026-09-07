package com.badr.teamprojectmanagement.team.dtos;

import java.util.UUID;

public record TeamMemberResponse(

        UUID id,

        UUID teamId,

        UUID userId
) {
}