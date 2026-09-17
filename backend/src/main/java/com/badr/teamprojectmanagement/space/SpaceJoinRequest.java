package com.badr.teamprojectmanagement.space;

import com.badr.teamprojectmanagement.common.entity.BaseEntity;
import com.badr.teamprojectmanagement.common.enums.SpaceJoinRequestStatus;
import com.badr.teamprojectmanagement.user.User;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(
        name = "space_join_requests",
        uniqueConstraints = {
                @UniqueConstraint(
                        name = "uq_space_join_request",
                        columnNames = {"space_id", "user_id"}
                )
        }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SpaceJoinRequest extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(
            name = "space_id",
            nullable = false,
            foreignKey = @ForeignKey(name = "fk_space_join_request_space")
    )
    private Space space;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(
            name = "user_id",
            nullable = false,
            foreignKey = @ForeignKey(name = "fk_space_join_request_user")
    )
    private User user;

    @Builder.Default
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private SpaceJoinRequestStatus status =
            SpaceJoinRequestStatus.PENDING;
}