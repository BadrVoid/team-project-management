package com.badr.teamprojectmanagement.auth.dtos;

public record LoginResponse(
        String accessToken,
        String refreshToken
) {
}