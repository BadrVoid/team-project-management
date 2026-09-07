package com.badr.teamprojectmanagement.task;

import com.badr.teamprojectmanagement.common.entity.BaseEntity;
import com.badr.teamprojectmanagement.user.User;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "task_comments")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TaskComment extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "task_id", nullable = false)
    private Task task;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String content;
}