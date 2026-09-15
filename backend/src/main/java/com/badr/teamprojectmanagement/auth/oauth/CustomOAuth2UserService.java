package com.badr.teamprojectmanagement.auth.oauth;

import com.badr.teamprojectmanagement.auth.AuthProvider;
import com.badr.teamprojectmanagement.auth.UserAuthentication;
import com.badr.teamprojectmanagement.auth.UserAuthenticationRepository;
import com.badr.teamprojectmanagement.user.User;
import com.badr.teamprojectmanagement.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserService;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CustomOAuth2UserService
        implements OAuth2UserService<OAuth2UserRequest, OAuth2User> {

    private final UserRepository userRepository;
    private final UserAuthenticationRepository userAuthenticationRepository;
    private final PasswordEncoder passwordEncoder;

    private final DefaultOAuth2UserService delegate =
            new DefaultOAuth2UserService();

    @Override
    @Transactional
    public OAuth2User loadUser(
            OAuth2UserRequest userRequest
    ) throws OAuth2AuthenticationException {

        OAuth2User oauth2User = delegate.loadUser(userRequest);

        Map<String, Object> attributes =
                oauth2User.getAttributes();

        String providerId = extractProviderId(attributes);

        String email = extractEmail(attributes);

        String firstName = extractFirstName(attributes);

        String lastName = extractLastName(attributes);

        User user = processUser(
                AuthProvider.GITHUB,
                providerId,
                email,
                firstName,
                lastName
        );

        return new OAuth2UserPrincipal(
                user,
                attributes
        );
    }

    private User processUser(
            AuthProvider provider,
            String providerId,
            String email,
            String firstName,
            String lastName
    ) {

        var existingAuthentication =
                userAuthenticationRepository
                        .findByProviderAndProviderId(
                                provider,
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
                            .provider(provider)
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
                        .provider(provider)
                        .providerId(providerId)
                        .build();

        userAuthenticationRepository.save(authentication);

        return newUser;
    }

    private String extractProviderId(
            Map<String, Object> attributes
    ) {

        Object id = attributes.get("id");

        if (id == null) {
            throw new OAuth2AuthenticationException(
                    "GitHub user ID is missing"
            );
        }

        return id.toString();
    }

    private String extractEmail(
            Map<String, Object> attributes
    ) {

        Object email = attributes.get("email");

        if (email == null || email.toString().isBlank()) {
            throw new OAuth2AuthenticationException(
                    "GitHub email is not available"
            );
        }

        return email.toString().toLowerCase();
    }

    private String extractFirstName(
            Map<String, Object> attributes
    ) {

        Object name = attributes.get("name");

        if (name != null && !name.toString().isBlank()) {

            String fullName = name.toString();

            return fullName.contains(" ")
                    ? fullName.substring(
                    0,
                    fullName.indexOf(" ")
            )
                    : fullName;
        }

        Object login = attributes.get("login");

        return login != null
                ? login.toString()
                : "User";
    }

    private String extractLastName(
            Map<String, Object> attributes
    ) {

        Object name = attributes.get("name");

        if (name != null && !name.toString().isBlank()) {

            String fullName = name.toString();

            if (fullName.contains(" ")) {
                return fullName.substring(
                        fullName.indexOf(" ") + 1
                );
            }
        }

        return "";
    }
}