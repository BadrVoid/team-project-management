package com.badr.teamprojectmanagement.notification.dtos;

import com.badr.teamprojectmanagement.common.enums.NotificationType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.util.UUID;

public record NotificationCreateRequest(

        @NotNull(message = "User ID is required")
        UUID userId,

        @NotNull(message = "Notification type is required")
        NotificationType type,

        @NotBlank(message = "Message is required")
        @Size(max = 255, message = "Message must not exceed 255 characters")
        String message

) {}