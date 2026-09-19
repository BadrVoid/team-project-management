package com.badr.teamprojectmanagement.space;

import com.badr.teamprojectmanagement.common.entity.BaseEntity;
import com.badr.teamprojectmanagement.common.enums.SpaceMemberRole;
import com.badr.teamprojectmanagement.user.User;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(
        name = "space_members",
        uniqueConstraints = {
                @UniqueConstraint(
                        name = "uq_space_member",
                        columnNames = {"space_id", "user_id"}
                )
        }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SpaceMember extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(
            name = "space_id",
            nullable = false,
            foreignKey = @ForeignKey(name = "fk_space_member_space")
    )
    private Space space;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(
            name = "user_id",
            nullable = false,
            foreignKey = @ForeignKey(name = "fk_space_member_user")
    )
    private User user;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private SpaceMemberRole role;
}
