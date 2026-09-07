package com.badr.teamprojectmanagement.team;

import com.badr.teamprojectmanagement.common.entity.BaseEntity;
import com.badr.teamprojectmanagement.project.Project;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(
        name = "teams",
        uniqueConstraints = {
                @UniqueConstraint(columnNames = {"project_id", "name"})
        }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Team extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "project_id", nullable = false)
    private Project project;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;
}