package com.badr.teamprojectmanagement.space.service;

import com.badr.teamprojectmanagement.exception.ResourceNotFoundException;
import com.badr.teamprojectmanagement.space.Space;
import com.badr.teamprojectmanagement.space.SpaceRepository;
import com.badr.teamprojectmanagement.space.dtos.SpaceCreateRequest;
import com.badr.teamprojectmanagement.space.dtos.SpaceResponse;
import com.badr.teamprojectmanagement.space.dtos.SpaceUpdateRequest;
import com.badr.teamprojectmanagement.user.User;
import com.badr.teamprojectmanagement.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class SpaceServiceImpl implements SpaceService {

    private final SpaceRepository spaceRepository;
    private final UserRepository userRepository;

    @Override
    public SpaceResponse createSpace(UUID ownerId, SpaceCreateRequest request) {

        //Find owner
        User owner = userRepository.findById(ownerId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found")
                );

        //Create space
        Space space = Space.builder()
                .name(request.name())
                .description(request.description())
                .owner(owner)
                .build();

        //Save space
        spaceRepository.save(space);

        return mapToResponse(space);
    }

    @Override
    @Transactional(readOnly = true)
    public SpaceResponse getSpaceById(UUID id) {

        //Find space
        Space space = spaceRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Space not found")
                );

        return mapToResponse(space);
    }

    @Override
    @Transactional(readOnly = true)
    public List<SpaceResponse> getSpacesByOwner(UUID ownerId) {

        //Find owner
        User owner = userRepository.findById(ownerId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found")
                );

        //Find spaces
        return spaceRepository.findByOwner(owner)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public SpaceResponse updateSpace(UUID id, SpaceUpdateRequest request) {

        //Find space
        Space space = spaceRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Space not found")
                );

        //Update space information
        space.setName(request.name());
        space.setDescription(request.description());

        //Save updated space
        spaceRepository.save(space);

        return mapToResponse(space);
    }

    @Override
    public void deleteSpace(UUID id) {

        //Check if space exists
        if (!spaceRepository.existsById(id)) {
            throw new ResourceNotFoundException("Space not found");
        }

        //Delete space
        spaceRepository.deleteById(id);
    }

    private SpaceResponse mapToResponse(Space space) {

        return new SpaceResponse(
                space.getId(),
                space.getName(),
                space.getDescription(),
                space.getOwner().getId()
        );
    }
}