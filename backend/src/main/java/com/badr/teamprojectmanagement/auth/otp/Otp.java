package com.badr.teamprojectmanagement.auth.otp;


import com.badr.teamprojectmanagement.common.entity.BaseEntity;
import com.badr.teamprojectmanagement.common.enums.OtpType;
import com.badr.teamprojectmanagement.user.User;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(
        name = "otps",
        indexes = {
                @Index(name = "idx_otp_user_type", columnList = "user_id,type"),
                @Index(name = "idx_otp_expires_at", columnList = "expires_at")
        }
)
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Otp extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(
            name = "user_id",
            nullable = false,
            foreignKey = @ForeignKey(name = "fk_otp_user")
    )
    private User user;

    @Column(name = "otp_hash", nullable = false)
    private String otpHash;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private OtpType type;

    @Column(name = "expires_at", nullable = false)
    private LocalDateTime expiresAt;

    @Column(nullable = false)
    @Builder.Default
    private boolean used = false;

    @Column(nullable = false)
    @Builder.Default
    private int attempts = 0;
}