package com.badr.teamprojectmanagement.auth.otp;

import com.badr.teamprojectmanagement.common.email.EmailService;
import com.badr.teamprojectmanagement.common.enums.OtpType;
import com.badr.teamprojectmanagement.exception.BadRequestException;
import com.badr.teamprojectmanagement.user.User;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class OtpServiceImpl implements OtpService {

    private static final int OTP_EXPIRATION_MINUTES = 5;
    private static final int RESEND_COOLDOWN_SECONDS = 60;
    private static final int MAX_ATTEMPTS = 5;

    private final OtpRepository otpRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;

    private final SecureRandom secureRandom = new SecureRandom();

    @Override
    public void generateAndSendOtp(User user, OtpType type) {

        // Check if there is an existing active OTP
        var existingOtp = otpRepository
                .findTopByUserAndTypeAndUsedFalseOrderByCreatedAtDesc(
                        user,
                        type
                );

        // Check resend cooldown
        if (existingOtp.isPresent()) {

            Otp otp = existingOtp.get();

            LocalDateTime cooldownTime =
                    otp.getCreatedAt()
                            .plusSeconds(RESEND_COOLDOWN_SECONDS);

            if (LocalDateTime.now().isBefore(cooldownTime)) {
                throw new BadRequestException(
                        "Please wait before requesting a new OTP"
                );
            }
        }

        // Invalidate previous OTP
        invalidatePreviousOtp(user, type);

        // Generate a new OTP
        String otpCode = generateOtp();

        // Hash OTP before storing it
        String otpHash = passwordEncoder.encode(otpCode);

        // Create OTP entity
        Otp otp = Otp.builder()
                .user(user)
                .otpHash(otpHash)
                .type(type)
                .expiresAt(
                        LocalDateTime.now()
                                .plusMinutes(OTP_EXPIRATION_MINUTES)
                )
                .used(false)
                .attempts(0)
                .build();

        // Save OTP
        otpRepository.save(otp);

        // Send the ORIGINAL OTP by email
        emailService.sendOtp(
                user.getEmail(),
                otpCode,
                type
        );
    }

    @Override
    public void verifyOtp(
            User user,
            OtpType type,
            String otp
    ) {

        Otp savedOtp = otpRepository
                .findTopByUserAndTypeAndUsedFalseOrderByCreatedAtDesc(
                        user,
                        type
                )
                .orElseThrow(() ->
                        new BadRequestException(
                                "Invalid or expired OTP"
                        )
                );

        // Check expiration
        if (savedOtp.getExpiresAt()
                .isBefore(LocalDateTime.now())) {

            savedOtp.setUsed(true);
            otpRepository.save(savedOtp);

            throw new BadRequestException(
                    "OTP has expired"
            );
        }

        // Check maximum attempts
        if (savedOtp.getAttempts() >= MAX_ATTEMPTS) {

            savedOtp.setUsed(true);
            otpRepository.save(savedOtp);

            throw new BadRequestException(
                    "Maximum OTP attempts exceeded"
            );
        }

        // Increase attempts
        savedOtp.setAttempts(
                savedOtp.getAttempts() + 1
        );

        // Check OTP
        if (!passwordEncoder.matches(
                otp,
                savedOtp.getOtpHash()
        )) {

            otpRepository.save(savedOtp);

            throw new BadRequestException(
                    "Invalid OTP"
            );
        }

        // OTP is valid
        savedOtp.setUsed(true);
        otpRepository.save(savedOtp);

        if (type == OtpType.EMAIL_VERIFICATION) {
            user.setVerified(true);
        }
    }

    @Override
    public void invalidatePreviousOtp(
            User user,
            OtpType type
    ) {

        otpRepository
                .findTopByUserAndTypeAndUsedFalseOrderByCreatedAtDesc(
                        user,
                        type
                )
                .ifPresent(otp -> {
                    otp.setUsed(true);
                    otpRepository.save(otp);
                });
    }

    private String generateOtp() {

        return String.format(
                "%06d",
                secureRandom.nextInt(1_000_000)
        );
    }
}