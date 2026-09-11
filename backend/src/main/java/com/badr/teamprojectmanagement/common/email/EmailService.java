package com.badr.teamprojectmanagement.common.email;

import com.badr.teamprojectmanagement.common.enums.OtpType;

public interface EmailService {

    void sendOtp(
            String to,
            String otp,
            OtpType type
    );
}