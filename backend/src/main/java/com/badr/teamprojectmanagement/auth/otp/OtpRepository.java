package com.badr.teamprojectmanagement.auth.otp;

import com.badr.teamprojectmanagement.common.enums.OtpType;
import com.badr.teamprojectmanagement.user.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface OtpRepository extends JpaRepository<Otp, UUID> {

    Optional<Otp> findTopByUserAndTypeAndUsedFalseOrderByCreatedAtDesc(
            User user,
            OtpType type
    );
}