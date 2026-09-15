package com.badr.teamprojectmanagement.auth;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface UserAuthenticationRepository
        extends JpaRepository<UserAuthentication, UUID> {

    Optional<UserAuthentication> findByProviderAndProviderId(
            AuthProvider provider,
            String providerId
    );

    boolean existsByProviderAndProviderId(
            AuthProvider provider,
            String providerId
    );
}