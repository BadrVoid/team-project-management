package com.badr.teamprojectmanagement.notification.service;

import com.badr.teamprojectmanagement.common.enums.NotificationType;
import com.badr.teamprojectmanagement.exception.ResourceNotFoundException;
import com.badr.teamprojectmanagement.notification.Notification;
import com.badr.teamprojectmanagement.notification.NotificationMapper;
import com.badr.teamprojectmanagement.notification.NotificationRepository;
import com.badr.teamprojectmanagement.notification.dtos.NotificationResponse;
import com.badr.teamprojectmanagement.user.User;
import com.badr.teamprojectmanagement.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class NotificationServiceImpl
        implements NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;
    private final NotificationMapper notificationMapper;

    @Override
    public NotificationResponse createNotification(
            UUID userId,
            NotificationType type,
            String message
    ) {

        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "User not found"
                        ));

        Notification notification = Notification.builder()
                .user(user)
                .type(type)
                .message(message)
                .build();

        Notification saved =
                notificationRepository.save(notification);

        return notificationMapper.toResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public List<NotificationResponse> getMyNotifications(
            UUID userId
    ) {

        return notificationRepository
                .findByUserIdOrderByCreatedAtDesc(userId)
                .stream()
                .map(notificationMapper::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<NotificationResponse> getMyUnreadNotifications(
            UUID userId
    ) {

        return notificationRepository
                .findByUserIdAndReadFalseOrderByCreatedAtDesc(userId)
                .stream()
                .map(notificationMapper::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public long getUnreadCount(UUID userId) {

        return notificationRepository
                .countByUserIdAndReadFalse(userId);
    }

    @Override
    public void markAsRead(
            UUID notificationId,
            UUID userId
    ) {

        Notification notification = findNotification(
                notificationId
        );

        verifyOwner(notification, userId);

        notification.setRead(true);
    }

    @Override
    public void markAllAsRead(UUID userId) {

        List<Notification> notifications =
                notificationRepository
                        .findByUserIdAndReadFalseOrderByCreatedAtDesc(
                                userId
                        );

        notifications.forEach(notification ->
                notification.setRead(true)
        );
    }

    @Override
    public void deleteNotification(
            UUID notificationId,
            UUID userId
    ) {

        Notification notification =
                findNotification(notificationId);

        verifyOwner(notification, userId);

        notificationRepository.delete(notification);
    }

    private Notification findNotification(
            UUID notificationId
    ) {

        return notificationRepository.findById(notificationId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Notification not found"
                        ));
    }

    private void verifyOwner(
            Notification notification,
            UUID userId
    ) {

        if (!notification.getUser().getId().equals(userId)) {
            throw new AccessDeniedException(
                    "You are not allowed to access this notification"
            );
        }
    }
}