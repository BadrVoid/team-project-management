package com.badr.teamprojectmanagement.notification.dtos;

import com.badr.teamprojectmanagement.common.enums.NotificationType;

import java.time.LocalDateTime;
import java.util.UUID;

public record NotificationResponse(
        UUID id,
        NotificationType type,
        String message,
        boolean read,
        LocalDateTime createdAt
) {}