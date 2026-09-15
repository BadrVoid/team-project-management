package com.badr.teamprojectmanagement.notification.controller;

import com.badr.teamprojectmanagement.common.response.GlobalResponse;
import com.badr.teamprojectmanagement.notification.dtos.NotificationResponse;
import com.badr.teamprojectmanagement.notification.service.NotificationService;
import com.badr.teamprojectmanagement.user.User;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;

    @GetMapping
    public GlobalResponse<List<NotificationResponse>> getMyNotifications(
            @AuthenticationPrincipal User user
    ) {

        List<NotificationResponse> response =
                notificationService.getMyNotifications(
                        user.getId()
                );

        return GlobalResponse.success(
                "Notifications retrieved successfully",
                response
        );
    }

    @GetMapping("/unread")
    public GlobalResponse<List<NotificationResponse>> getUnreadNotifications(
            @AuthenticationPrincipal User user
    ) {

        List<NotificationResponse> response =
                notificationService.getMyUnreadNotifications(
                        user.getId()
                );

        return GlobalResponse.success(
                "Unread notifications retrieved successfully",
                response
        );
    }

    @GetMapping("/unread/count")
    public GlobalResponse<Long> getUnreadCount(
            @AuthenticationPrincipal User user
    ) {

        long count =
                notificationService.getUnreadCount(
                        user.getId()
                );

        return GlobalResponse.success(
                "Unread notification count retrieved successfully",
                count
        );
    }

    @PatchMapping("/{id}/read")
    public GlobalResponse<Void> markAsRead(
            @PathVariable UUID id,
            @AuthenticationPrincipal User user
    ) {

        notificationService.markAsRead(
                id,
                user.getId()
        );

        return GlobalResponse.success(
                "Notification marked as read",
                null
        );
    }

    @PatchMapping("/read-all")
    public GlobalResponse<Void> markAllAsRead(
            @AuthenticationPrincipal User user
    ) {

        notificationService.markAllAsRead(
                user.getId()
        );

        return GlobalResponse.success(
                "All notifications marked as read",
                null
        );
    }

    @DeleteMapping("/{id}")
    public GlobalResponse<Void> deleteNotification(
            @PathVariable UUID id,
            @AuthenticationPrincipal User user
    ) {

        notificationService.deleteNotification(
                id,
                user.getId()
        );

        return GlobalResponse.success(
                "Notification deleted successfully",
                null
        );
    }
}