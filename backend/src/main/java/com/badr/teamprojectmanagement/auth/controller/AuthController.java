package com.badr.teamprojectmanagement.auth.controller;

import com.badr.teamprojectmanagement.auth.dtos.ChangePasswordRequest;
import com.badr.teamprojectmanagement.auth.dtos.ForgotPasswordRequest;
import com.badr.teamprojectmanagement.auth.dtos.LoginRequest;
import com.badr.teamprojectmanagement.auth.dtos.LoginResponse;
import com.badr.teamprojectmanagement.auth.dtos.RefreshTokenRequest;
import com.badr.teamprojectmanagement.auth.dtos.RegisterRequest;
import com.badr.teamprojectmanagement.auth.dtos.ResetPasswordRequest;
import com.badr.teamprojectmanagement.auth.dtos.VerifyOtpRequest;
import com.badr.teamprojectmanagement.auth.AuthService;
import com.badr.teamprojectmanagement.common.response.GlobalResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<GlobalResponse<Void>> register(
            @Valid @RequestBody RegisterRequest request
    ) {
        authService.register(request);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(GlobalResponse.success(
                        "Registration successful. Please verify your email.",
                        null
                ));
    }

    @PostMapping("/login")
    public ResponseEntity<GlobalResponse<LoginResponse>> login(
            @Valid @RequestBody LoginRequest request
    ) {
        LoginResponse response = authService.login(request);

        return ResponseEntity.ok(
                GlobalResponse.success("Login successful", response)
        );
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<GlobalResponse<Void>> verifyOtp(
            @Valid @RequestBody VerifyOtpRequest request
    ) {
        authService.verifyOtp(request);

        return ResponseEntity.ok(
                GlobalResponse.success("OTP verified successfully", null)
        );
    }

    @PostMapping("/refresh")
    public ResponseEntity<GlobalResponse<LoginResponse>> refreshToken(
            @Valid @RequestBody RefreshTokenRequest request
    ) {
        LoginResponse response = authService.refreshToken(request);

        return ResponseEntity.ok(
                GlobalResponse.success("Token refreshed successfully", response)
        );
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<GlobalResponse<Void>> forgotPassword(
            @Valid @RequestBody ForgotPasswordRequest request
    ) {
        authService.forgotPassword(request);

        return ResponseEntity.ok(
                GlobalResponse.success(
                        "If the email exists, a password reset OTP has been sent.",
                        null
                )
        );
    }

    @PostMapping("/reset-password")
    public ResponseEntity<GlobalResponse<Void>> resetPassword(
            @Valid @RequestBody ResetPasswordRequest request
    ) {
        authService.resetPassword(request);

        return ResponseEntity.ok(
                GlobalResponse.success("Password reset successfully", null)
        );
    }

    @PostMapping("/change-password")
    public ResponseEntity<GlobalResponse<Void>> changePassword(
            @RequestParam UUID userId,
            @Valid @RequestBody ChangePasswordRequest request
    ) {
        authService.changePassword(userId, request);

        return ResponseEntity.ok(
                GlobalResponse.success("Password changed successfully", null)
        );
    }


    @PostMapping("/logout")
    public ResponseEntity<GlobalResponse<Void>> logout(
            @Valid @RequestBody RefreshTokenRequest request
    ) {
        authService.logout(request);

        return ResponseEntity.ok(
                GlobalResponse.success("Logout successful", null)
        );
    }
}