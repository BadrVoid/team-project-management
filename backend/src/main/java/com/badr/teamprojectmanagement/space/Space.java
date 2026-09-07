package com.badr.teamprojectmanagement.space;

import com.badr.teamprojectmanagement.common.entity.BaseEntity;
import com.badr.teamprojectmanagement.user.User;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "spaces")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Space extends BaseEntity {

    @Column(nullable = false, length = 100)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(
            name = "owner_id",
            nullable = false,
            foreignKey = @ForeignKey(name = "fk_space_owner")
    )
    private User owner;
}