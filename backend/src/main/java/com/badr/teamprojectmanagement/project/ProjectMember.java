package com.badr.teamprojectmanagement.project;

import com.badr.teamprojectmanagement.common.entity.BaseEntity;
import com.badr.teamprojectmanagement.common.enums.ProjectMemberRole;
import com.badr.teamprojectmanagement.user.User;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(
        name = "project_members",
        uniqueConstraints = {
                @UniqueConstraint(columnNames = {"project_id", "user_id"})
        }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProjectMember extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "project_id", nullable = false)
    private Project project;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    @Builder.Default
    private ProjectMemberRole role = ProjectMemberRole.MEMBER;
}