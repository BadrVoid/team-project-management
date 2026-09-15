package com.badr.teamprojectmanagement.common.email;

import com.badr.teamprojectmanagement.common.enums.OtpType;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class EmailServiceImpl implements EmailService {

    private final JavaMailSender mailSender;

    @Override
    public void sendOtp(
            String to,
            String otp,
            OtpType type
    ) {
        String subject;
        String headerTitle;
        String description;

        if (type == OtpType.EMAIL_VERIFICATION) {
            subject = "Verify your email - Team Project Management";
            headerTitle = "Verify Your Email";
            description = "Thank you for joining Team Project Management! Please use the verification code below to complete your registration process.";
        } else if (type == OtpType.PASSWORD_RESET) {
            subject = "Password Reset - Team Project Management";
            headerTitle = "Reset Your Password";
            description = "We received a request to reset your password. Use the verification code below to securely set a new password.";
        } else {
            subject = "Verification Code - Team Project Management";
            headerTitle = "Your Verification Code";
            description = "Please use the verification code below to complete your action.";
        }

        String htmlContent = buildOtpEmailTemplate(
                headerTitle,
                description,
                otp,
                "5 minutes"
        );

        sendHtmlMessage(to, subject, htmlContent);
    }

    private void sendHtmlMessage(String to, String subject, String htmlBody) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(htmlBody, true); // true indicates HTML content

            mailSender.send(message);
        } catch (MessagingException e) {
            log.error("Failed to send email to {}", to, e);
            throw new RuntimeException("Failed to send email", e);
        }
    }

    private String buildOtpEmailTemplate(String title, String description, String otp, String expirationTime) {
        return """
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>%s</title>
            </head>
            <body style="margin: 0; padding: 0; background-color: #f4f6f9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
                <table border="0" cellpadding="0" cellspacing="0" width="100%%" style="background-color: #f4f6f9; padding: 40px 0;">
                    <tr>
                        <td align="center">
                            <table border="0" cellpadding="0" cellspacing="0" width="100%%" style="max-width: 520px; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);">
                                
                                <!-- Header -->
                                <tr>
                                    <td align="center" style="background-color: #1e293b; padding: 28px 20px;">
                                        <h1 style="color: #ffffff; margin: 0; font-size: 20px; font-weight: 600; letter-spacing: 0.5px;">
                                            Team Project Management
                                        </h1>
                                    </td>
                                </tr>

                                <!-- Body -->
                                <tr>
                                    <td style="padding: 36px 32px; color: #334155; font-size: 15px; line-height: 1.6;">
                                        <h2 style="color: #0f172a; margin-top: 0; margin-bottom: 12px; font-size: 18px; font-weight: 600;">
                                            %s
                                        </h2>
                                        <p style="margin: 0 0 24px 0; color: #475569;">
                                            %s
                                        </p>

                                        <!-- OTP Box -->
                                        <div style="background-color: #f8fafc; border: 1px dashed #cbd5e1; border-radius: 6px; padding: 20px; text-align: center; margin-bottom: 24px;">
                                            <span style="font-family: 'Courier New', Courier, monospace; font-size: 32px; font-weight: 700; letter-spacing: 8px; color: #2563eb;">
                                                %s
                                            </span>
                                        </div>

                                        <p style="margin: 0 0 16px 0; font-size: 13px; color: #64748b; text-align: center;">
                                            This code will expire in <strong>%s</strong>.
                                        </p>
                                        
                                        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;" />

                                        <p style="margin: 0; font-size: 12px; color: #94a3b8; text-align: center;">
                                            If you did not request this email, please ignore it or contact support if you have concerns.
                                        </p>
                                    </td>
                                </tr>

                                <!-- Footer -->
                                <tr>
                                    <td align="center" style="background-color: #f8fafc; padding: 16px; border-top: 1px solid #e2e8f0; font-size: 12px; color: #94a3b8;">
                                        &copy; %d Team Project Management. All rights reserved.
                                    </td>
                                </tr>

                            </table>
                        </td>
                    </tr>
                </table>
            </body>
            </html>
            """.formatted(title, title, description, otp, expirationTime, java.time.Year.now().getValue());
    }
}