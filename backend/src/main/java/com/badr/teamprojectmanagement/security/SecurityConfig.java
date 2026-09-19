package com.badr.teamprojectmanagement.security;

import com.badr.teamprojectmanagement.auth.oauth.CustomOAuth2UserService;
import com.badr.teamprojectmanagement.auth.oauth.CustomOidcUserService;
import com.badr.teamprojectmanagement.auth.oauth.OAuth2AuthenticationSuccessHandler;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    private final CustomOAuth2UserService customOAuth2UserService;

    private final CustomOidcUserService customOidcUserService;

    private final OAuth2AuthenticationSuccessHandler
            oauth2AuthenticationSuccessHandler;

    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http
    ) throws Exception {

        http
                .csrf(AbstractHttpConfigurer::disable)

                .cors(cors ->
                        cors.configurationSource(corsConfigurationSource())
                )

                /*
                 * OAuth2 login needs a temporary session during
                 * the authorization-code redirect flow.
                 *
                 * Your normal API authentication is still JWT-based.
                 */
                .sessionManagement(session ->
                        session.sessionCreationPolicy(
                                SessionCreationPolicy.IF_REQUIRED
                        )
                )

                .authorizeHttpRequests(auth -> auth

                        // Swagger
                        .requestMatchers(
                                "/swagger-ui/**",
                                "/swagger-ui.html",
                                "/v3/api-docs/**"
                        ).permitAll()

                        // Local authentication
                        .requestMatchers("/api/auth/**")
                        .permitAll()

                        // OAuth2
                        .requestMatchers(
                                "/api/auth/oauth2/**",
                                "/oauth2/**",
                                "/login/oauth2/**"
                        ).permitAll()

                        .anyRequest().authenticated()
                )

                /*
                 * OAuth2 Login
                 */
                .oauth2Login(oauth2 -> oauth2

                        .userInfoEndpoint(userInfo -> userInfo

                                .userService(
                                        customOAuth2UserService
                                )

                                .oidcUserService(
                                        customOidcUserService
                                )
                        )

                        .successHandler(
                                oauth2AuthenticationSuccessHandler
                        )
                )

                /*
                 * Our existing JWT authentication.
                 */
                .addFilterBefore(
                        jwtAuthenticationFilter,
                        UsernamePasswordAuthenticationFilter.class
                );

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();

        configuration.setAllowedOrigins(List.of(
                "http://localhost:5173"
        ));

        configuration.setAllowedMethods(List.of(
                "GET",
                "POST",
                "PUT",
                "PATCH",
                "DELETE",
                "OPTIONS"
        ));

        configuration.setAllowedHeaders(List.of("*"));

        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source =
                new UrlBasedCorsConfigurationSource();

        source.registerCorsConfiguration(
                "/**",
                configuration
        );

        return source;
    }


}
