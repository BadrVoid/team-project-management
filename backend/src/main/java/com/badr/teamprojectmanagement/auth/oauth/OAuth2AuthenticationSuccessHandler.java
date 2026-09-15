package com.badr.teamprojectmanagement.auth.oauth;

import com.badr.teamprojectmanagement.auth.AuthService;
import com.badr.teamprojectmanagement.auth.dtos.LoginResponse;
import com.badr.teamprojectmanagement.user.User;
import com.badr.teamprojectmanagement.user.UserRepository;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;
import org.springframework.stereotype.Component;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class OAuth2AuthenticationSuccessHandler
        implements AuthenticationSuccessHandler {

    private final AuthService authService;
    private final UserRepository userRepository;

    @Override
    public void onAuthenticationSuccess(
            HttpServletRequest request,
            HttpServletResponse response,
            Authentication authentication
    ) throws IOException, ServletException {

        Object principal = authentication.getPrincipal();

        User user;

        if (principal instanceof OAuth2UserPrincipal oauth2UserPrincipal) {

            user = userRepository
                    .findById(oauth2UserPrincipal.getUserId())
                    .orElseThrow(() ->
                            new IllegalStateException(
                                    "OAuth user not found"
                            )
                    );

        } else if (principal instanceof OidcUser oidcUser) {

            String email = oidcUser.getEmail();

            user = authService.findUserForOAuth(email);

        } else {

            throw new IllegalStateException(
                    "Unsupported OAuth principal: "
                            + principal.getClass().getName()
            );
        }

        LoginResponse loginResponse =
                authService.loginWithOAuthUser(user);

        String redirectUrl =
                "http://localhost:5173/oauth/callback"
                        + "?accessToken="
                        + loginResponse.accessToken()
                        + "&refreshToken="
                        + loginResponse.refreshToken();

        response.sendRedirect(redirectUrl);
    }
}