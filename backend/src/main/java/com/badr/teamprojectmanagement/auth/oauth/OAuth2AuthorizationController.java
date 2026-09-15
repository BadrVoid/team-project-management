package com.badr.teamprojectmanagement.auth.oauth;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth/oauth2")
@RequiredArgsConstructor
public class OAuth2AuthorizationController {

    @GetMapping("/{provider}")
    public ResponseEntity<Void> authorize(
            @PathVariable String provider,
            @RequestParam(defaultValue = "login") String action,
            HttpServletRequest request
    ) {

        if (!provider.equals("google")
                && !provider.equals("github")) {

            return ResponseEntity.badRequest().build();
        }

        if (!action.equals("login")
                && !action.equals("register")) {

            return ResponseEntity.badRequest().build();
        }

        request.getSession(true)
                .setAttribute("OAUTH_ACTION", action);

        return ResponseEntity
                .status(HttpStatus.FOUND)
                .header(
                        "Location",
                        "/oauth2/authorization/" + provider
                )
                .build();
    }
}