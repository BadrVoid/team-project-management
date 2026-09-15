package com.badr.teamprojectmanagement.security;

import com.badr.teamprojectmanagement.user.User;

public interface JwtService {

    String generateToken(User user);

    String extractUsername(String token);

    boolean isTokenValid(String token, User user);

    boolean isTokenExpired(String token);
}