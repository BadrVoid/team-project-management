package com.badr.teamprojectmanagement.notification.service;

import com.badr.teamprojectmanagement.common.enums.NotificationType;
import com.badr.teamprojectmanagement.notification.dtos.NotificationResponse;

import java.util.List;
import java.util.UUID;

public interface NotificationService {

    NotificationResponse createNotification(
            UUID userId,
            NotificationType type,
            String message
    );

    List<NotificationResponse> getMyNotifications(
            UUID userId
    );

    List<NotificationResponse> getMyUnreadNotifications(
            UUID userId
    );

    long getUnreadCount(
            UUID userId
    );

    void markAsRead(
            UUID notificationId,
            UUID userId
    );

    void markAllAsRead(
            UUID userId
    );

    void deleteNotification(
            UUID notificationId,
            UUID userId
    );
}