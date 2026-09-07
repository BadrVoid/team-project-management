package com.badr.teamprojectmanagement.team;

import com.badr.teamprojectmanagement.common.entity.BaseEntity;
import com.badr.teamprojectmanagement.common.enums.TeamMemberRole;
import com.badr.teamprojectmanagement.user.User;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(
        name = "team_members",
        uniqueConstraints = {
                @UniqueConstraint(columnNames = {"team_id", "user_id"})
        }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TeamMember extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "team_id", nullable = false)
    private Team team;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    @Builder.Default
    private TeamMemberRole role = TeamMemberRole.MEMBER;
}