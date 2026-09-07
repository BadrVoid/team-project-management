package com.badr.teamprojectmanagement.notification.dtos;

import com.badr.teamprojectmanagement.common.enums.NotificationType;

import java.time.LocalDateTime;
import java.util.UUID;

public record NotificationResponse(

        UUID id,

        String message,

        NotificationType type,

        boolean read,

        UUID userId,

        LocalDateTime createdAt
) {
}