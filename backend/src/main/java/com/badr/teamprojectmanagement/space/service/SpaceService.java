package com.badr.teamprojectmanagement.space.service;

import com.badr.teamprojectmanagement.space.dtos.PublicSpaceResponse;
import com.badr.teamprojectmanagement.space.dtos.SpaceCreateRequest;
import com.badr.teamprojectmanagement.space.dtos.SpaceResponse;
import com.badr.teamprojectmanagement.space.dtos.SpaceUpdateRequest;

import java.util.List;
import java.util.UUID;

public interface SpaceService {

    SpaceResponse createSpace(
            UUID ownerId,
            SpaceCreateRequest request
    );

    SpaceResponse getSpaceById(
            UUID id,
            UUID userId
    );

    List<SpaceResponse> getSpacesByOwner(
            UUID ownerId
    );

    List<PublicSpaceResponse> getPublicSpaces(
            UUID userId
    );

    PublicSpaceResponse joinSpace(
            UUID spaceId,
            UUID userId
    );

    SpaceResponse updateSpace(
            UUID id,
            UUID ownerId,
            SpaceUpdateRequest request
    );

    void deleteSpace(
            UUID id,
            UUID ownerId
    );
}