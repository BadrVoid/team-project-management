package com.badr.teamprojectmanagement.auth;

import com.badr.teamprojectmanagement.auth.dtos.ChangePasswordRequest;
import com.badr.teamprojectmanagement.auth.dtos.ForgotPasswordRequest;
import com.badr.teamprojectmanagement.auth.dtos.LoginRequest;
import com.badr.teamprojectmanagement.auth.dtos.LoginResponse;
import com.badr.teamprojectmanagement.auth.dtos.RefreshTokenRequest;
import com.badr.teamprojectmanagement.auth.dtos.RegisterRequest;
import com.badr.teamprojectmanagement.auth.dtos.ResetPasswordRequest;
import com.badr.teamprojectmanagement.auth.dtos.VerifyOtpRequest;
import com.badr.teamprojectmanagement.user.User;


import java.util.UUID;

public interface AuthService {

    void register(RegisterRequest request);

    LoginResponse login(LoginRequest request);

    void verifyOtp(VerifyOtpRequest request);

    LoginResponse refreshToken(RefreshTokenRequest request);

    LoginResponse loginWithOAuthUser(User user);

    User findUserForOAuth(String email);

    void forgotPassword(ForgotPasswordRequest request);

    void resetPassword(ResetPasswordRequest request);

    void changePassword(UUID userId, ChangePasswordRequest request);

    void logout(RefreshTokenRequest request);
}