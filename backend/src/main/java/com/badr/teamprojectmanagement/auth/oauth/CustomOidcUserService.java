package com.badr.teamprojectmanagement.auth.oauth;

import com.badr.teamprojectmanagement.auth.AuthProvider;
import com.badr.teamprojectmanagement.auth.UserAuthentication;
import com.badr.teamprojectmanagement.auth.UserAuthenticationRepository;
import com.badr.teamprojectmanagement.user.User;
import com.badr.teamprojectmanagement.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.client.oidc.userinfo.OidcUserRequest;
import org.springframework.security.oauth2.client.oidc.userinfo.OidcUserService;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CustomOidcUserService
        extends OidcUserService {

    private final UserRepository userRepository;
    private final UserAuthenticationRepository userAuthenticationRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public OidcUser loadUser(
            OidcUserRequest userRequest
    ) throws OAuth2AuthenticationException {

        OidcUser oidcUser =
                super.loadUser(userRequest);

        String providerId =
                oidcUser.getSubject();

        String email =
                oidcUser.getEmail();

        if (email == null || email.isBlank()) {
            throw new OAuth2AuthenticationException(
                    "Google email is not available"
            );
        }

        email = email.toLowerCase();

        String firstName =
                oidcUser.getGivenName();

        String lastName =
                oidcUser.getFamilyName();

        if (firstName == null || firstName.isBlank()) {
            firstName = "User";
        }

        if (lastName == null) {
            lastName = "";
        }

        processUser(
                providerId,
                email,
                firstName,
                lastName
        );

        return oidcUser;
    }

    private User processUser(
            String providerId,
            String email,
            String firstName,
            String lastName
    ) {

        var existingAuthentication =
                userAuthenticationRepository
                        .findByProviderAndProviderId(
                                AuthProvider.GOOGLE,
                                providerId
                        );

        if (existingAuthentication.isPresent()) {
            return existingAuthentication
                    .get()
                    .getUser();
        }

        var existingUser =
                userRepository.findByEmail(email);

        if (existingUser.isPresent()) {

            User user = existingUser.get();

            UserAuthentication authentication =
                    UserAuthentication.builder()
                            .user(user)
                            .provider(AuthProvider.GOOGLE)
                            .providerId(providerId)
                            .build();

            userAuthenticationRepository.save(authentication);

            return user;
        }

        User newUser = User.builder()
                .firstName(firstName)
                .lastName(lastName)
                .email(email)
                .password(
                        passwordEncoder.encode(
                                UUID.randomUUID().toString()
                        )
                )
                .verified(true)
                .build();

        newUser = userRepository.save(newUser);

        UserAuthentication authentication =
                UserAuthentication.builder()
                        .user(newUser)
                        .provider(AuthProvider.GOOGLE)
                        .providerId(providerId)
                        .build();

        userAuthenticationRepository.save(authentication);

        return newUser;
    }
}