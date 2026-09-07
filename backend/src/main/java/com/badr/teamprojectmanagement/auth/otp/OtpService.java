package com.badr.teamprojectmanagement.auth.otp;

import com.badr.teamprojectmanagement.common.enums.OtpType;
import com.badr.teamprojectmanagement.user.User;

public interface OtpService {

    void generateAndSendOtp(User user, OtpType type);
    void verifyOtp(User user, OtpType type, String otp);
    void invalidatePreviousOtp(User user, OtpType type);

}