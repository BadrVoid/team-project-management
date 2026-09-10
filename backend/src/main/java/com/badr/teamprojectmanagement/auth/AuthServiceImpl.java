
package com.badr.teamprojectmanagement.auth;

import com.badr.teamprojectmanagement.auth.RefreshToken;
import com.badr.teamprojectmanagement.auth.RefreshTokenRepository;
import com.badr.teamprojectmanagement.auth.dtos.ChangePasswordRequest;
import com.badr.teamprojectmanagement.auth.dtos.ForgotPasswordRequest;
import com.badr.teamprojectmanagement.auth.dtos.LoginRequest;
import com.badr.teamprojectmanagement.auth.dtos.LoginResponse;
import com.badr.teamprojectmanagement.auth.dtos.RefreshTokenRequest;
import com.badr.teamprojectmanagement.auth.dtos.RegisterRequest;
import com.badr.teamprojectmanagement.auth.dtos.ResetPasswordRequest;
import com.badr.teamprojectmanagement.auth.dtos.VerifyOtpRequest;
import com.badr.teamprojectmanagement.auth.otp.OtpService;
import com.badr.teamprojectmanagement.common.enums.OtpType;
import com.badr.teamprojectmanagement.exception.BadRequestException;
import com.badr.teamprojectmanagement.exception.ResourceNotFoundException;
import com.badr.teamprojectmanagement.security.JwtService;
import com.badr.teamprojectmanagement.user.User;
import com.badr.teamprojectmanagement.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class AuthServiceImpl implements com.badr.teamprojectmanagement.auth.service.AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final OtpService otpService;
    private final RefreshTokenRepository refreshTokenRepository;
    private final JwtService jwtService;

    @Override
    public void register(RegisterRequest request) {

        if (userRepository.existsByEmail(request.email())) {
            throw new BadRequestException("Email is already registered");
        }

        User user = User.builder()
                .firstName(request.firstName())
                .lastName(request.lastName())
                .email(request.email())
                .password(passwordEncoder.encode(request.password()))
                .build();

        userRepository.save(user);

        otpService.generateAndSendOtp(
                user,
                OtpType.EMAIL_VERIFICATION
        );
    }

    @Override
    public LoginResponse login(LoginRequest request) {

        User user = userRepository.findByEmail(request.email())
                .orElseThrow(() ->
                        new BadRequestException(
                                "Invalid email or password"
                        ));

        if (user.isBanned()) {
            throw new BadRequestException(
                    "Your account has been banned"
            );
        }

        if (!passwordEncoder.matches(
                request.password(),
                user.getPassword()
        )) {
            throw new BadRequestException(
                    "Invalid email or password"
            );
        }

        if (!user.isVerified()) {
            throw new BadRequestException(
                    "Please verify your email before logging in"
            );
        }

        String accessToken = jwtService.generateToken(user);

        RefreshToken refreshToken = createRefreshToken(user);

        return new LoginResponse(
                accessToken,
                refreshToken.getToken()
        );
    }

    @Override
    public void verifyOtp(VerifyOtpRequest request) {

        User user = findUserByEmail(request.email());

        otpService.verifyOtp(
                user,
                OtpType.EMAIL_VERIFICATION,
                request.otp()
        );
    }

    @Override
    public LoginResponse refreshToken(
            RefreshTokenRequest request
    ) {

        RefreshToken refreshToken =
                refreshTokenRepository.findByToken(
                        request.refreshToken()
                ).orElseThrow(() ->
                        new BadRequestException(
                                "Invalid refresh token"
                        ));

        if (refreshToken.getExpiresAt()
                .isBefore(LocalDateTime.now())) {

            refreshTokenRepository.delete(refreshToken);

            throw new BadRequestException(
                    "Refresh token has expired"
            );
        }

        User user = refreshToken.getUser();

        String accessToken = jwtService.generateToken(user);

        return new LoginResponse(
                accessToken,
                refreshToken.getToken()
        );
    }

    @Override
    public void forgotPassword(
            ForgotPasswordRequest request
    ) {

        User user = findUserByEmail(request.email());

        otpService.generateAndSendOtp(
                user,
                OtpType.PASSWORD_RESET
        );
    }

    @Override
    public void resetPassword(
            ResetPasswordRequest request
    ) {

        User user = findUserByEmail(request.email());

        otpService.verifyOtp(
                user,
                OtpType.PASSWORD_RESET,
                request.otp()
        );

        user.setPassword(
                passwordEncoder.encode(
                        request.newPassword()
                )
        );

        userRepository.save(user);

        otpService.invalidatePreviousOtp(
                user,
                OtpType.PASSWORD_RESET
        );
    }

    @Override
    public void changePassword(
            UUID userId,
            ChangePasswordRequest request
    ) {

        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "User not found"
                        ));

        if (!passwordEncoder.matches(
                request.currentPassword(),
                user.getPassword()
        )) {
            throw new BadRequestException(
                    "Current password is incorrect"
            );
        }

        user.setPassword(
                passwordEncoder.encode(
                        request.newPassword()
                )
        );

        userRepository.save(user);
    }

    @Override
    public void logout(RefreshTokenRequest request) {

        RefreshToken refreshToken =
                refreshTokenRepository.findByToken(
                        request.refreshToken()
                ).orElseThrow(() ->
                        new BadRequestException(
                                "Invalid refresh token"
                        ));

        refreshTokenRepository.delete(refreshToken);
    }

    private User findUserByEmail(String email) {

        return userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "User not found"
                        ));
    }

    private RefreshToken createRefreshToken(User user) {

        RefreshToken refreshToken = RefreshToken.builder()
                .user(user)
                .token(UUID.randomUUID().toString())
                .expiresAt(
                        LocalDateTime.now().plusDays(7)
                )
                .build();

        return refreshTokenRepository.save(refreshToken);
    }
}


