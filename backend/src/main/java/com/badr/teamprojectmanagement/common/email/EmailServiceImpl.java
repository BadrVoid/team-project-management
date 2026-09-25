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
        String title;
        String description;

        switch (type) {
            case EMAIL_VERIFICATION -> {
                subject = "Verify your email | Team Project Management";
                title = "Verify Your Email";
                description =
                        "Welcome to Team Project Management. " +
                                "Use the verification code below to verify your email address.";
            }

            case PASSWORD_RESET -> {
                subject = "Reset your password | Team Project Management";
                title = "Reset Your Password";
                description =
                        "We received a request to reset your password. " +
                                "Use the code below to continue.";
            }

            default -> {
                subject = "Your verification code | Team Project Management";
                title = "Verification Code";
                description =
                        "Use the verification code below to complete your request.";
            }
        }

        String htmlContent = buildOtpEmailTemplate(
                title,
                description,
                otp,
                "5 minutes"
        );

        sendHtmlMessage(to, subject, htmlContent);
    }

    private void sendHtmlMessage(
            String to,
            String subject,
            String htmlBody
    ) {
        try {
            MimeMessage message = mailSender.createMimeMessage();

            MimeMessageHelper helper =
                    new MimeMessageHelper(message, true, "UTF-8");

            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(htmlBody, true);

            mailSender.send(message);

            log.info("Email sent successfully to {}", to);

        } catch (MessagingException e) {
            log.error("Failed to send email to {}", to, e);
            throw new RuntimeException("Failed to send email", e);
        }
    }

    private String buildOtpEmailTemplate(
            String title,
            String description,
            String otp,
            String expirationTime
    ) {
        return """
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <meta name="color-scheme" content="light">
                <title>%s</title>
            </head>

            <body style="
                margin: 0;
                padding: 0;
                background-color: #f1f5f9;
                font-family: Arial, Helvetica, sans-serif;
                color: #0f172a;
            ">

                <table
                    width="100%%"
                    cellpadding="0"
                    cellspacing="0"
                    border="0"
                    style="
                        background-color: #f1f5f9;
                        padding: 40px 16px;
                    "
                >
                    <tr>
                        <td align="center">

                            <table
                                width="100%%"
                                cellpadding="0"
                                cellspacing="0"
                                border="0"
                                style="
                                    max-width: 520px;
                                    background-color: #ffffff;
                                    border-radius: 12px;
                                    overflow: hidden;
                                    border: 1px solid #e2e8f0;
                                "
                            >

                                <!-- Header -->
                                <tr>
                                    <td
                                        style="
                                            background-color: #0f172a;
                                            padding: 28px 32px;
                                            text-align: center;
                                        "
                                    >
                                        <div style="
                                            font-size: 13px;
                                            font-weight: 600;
                                            letter-spacing: 1.5px;
                                            text-transform: uppercase;
                                            color: #94a3b8;
                                            margin-bottom: 8px;
                                        ">
                                            Team Project Management
                                        </div>

                                        <div style="
                                            font-size: 22px;
                                            font-weight: 700;
                                            color: #ffffff;
                                        ">
                                            %s
                                        </div>
                                    </td>
                                </tr>

                                <!-- Content -->
                                <tr>
                                    <td style="padding: 36px 32px 32px 32px;">

                                        <p style="
                                            margin: 0 0 24px 0;
                                            font-size: 15px;
                                            line-height: 1.7;
                                            color: #475569;
                                        ">
                                            %s
                                        </p>

                                        <!-- OTP -->
                                        <table
                                            width="100%%"
                                            cellpadding="0"
                                            cellspacing="0"
                                            border="0"
                                            style="
                                                background-color: #f8fafc;
                                                border: 1px solid #e2e8f0;
                                                border-radius: 10px;
                                            "
                                        >
                                            <tr>
                                                <td
                                                    align="center"
                                                    style="padding: 24px 16px;"
                                                >
                                                    <div style="
                                                        font-size: 11px;
                                                        font-weight: 600;
                                                        letter-spacing: 1.5px;
                                                        text-transform: uppercase;
                                                        color: #64748b;
                                                        margin-bottom: 12px;
                                                    ">
                                                        Verification Code
                                                    </div>

                                                    <div style="
                                                        font-family: 'Courier New', monospace;
                                                        font-size: 32px;
                                                        font-weight: 700;
                                                        letter-spacing: 8px;
                                                        color: #2563eb;
                                                    ">
                                                        %s
                                                    </div>
                                                </td>
                                            </tr>
                                        </table>

                                        <!-- Expiration -->
                                        <p style="
                                            margin: 20px 0 0 0;
                                            text-align: center;
                                            font-size: 13px;
                                            line-height: 1.6;
                                            color: #64748b;
                                        ">
                                            This code expires in
                                            <strong style="color: #334155;">
                                                %s
                                            </strong>.
                                        </p>

                                        <!-- Divider -->
                                        <div style="
                                            height: 1px;
                                            background-color: #e2e8f0;
                                            margin: 28px 0;
                                        "></div>

                                        <!-- Security note -->
                                        <p style="
                                            margin: 0;
                                            text-align: center;
                                            font-size: 12px;
                                            line-height: 1.6;
                                            color: #94a3b8;
                                        ">
                                            If you didn't request this code,
                                            you can safely ignore this email.
                                            Never share your verification code with anyone.
                                        </p>

                                    </td>
                                </tr>

                                <!-- Footer -->
                                <tr>
                                    <td
                                        align="center"
                                        style="
                                            background-color: #f8fafc;
                                            border-top: 1px solid #e2e8f0;
                                            padding: 18px 24px;
                                        "
                                    >
                                        <p style="
                                            margin: 0;
                                            font-size: 11px;
                                            color: #94a3b8;
                                            line-height: 1.5;
                                        ">
                                            &copy; %d Team Project Management
                                        </p>
                                    </td>
                                </tr>

                            </table>

                        </td>
                    </tr>
                </table>

            </body>
            </html>
            """
                .formatted(
                        title,
                        title,
                        description,
                        otp,
                        expirationTime,
                        java.time.Year.now().getValue()
                );
    }
}