package com.badr.teamprojectmanagement.user.profile;

import com.badr.teamprojectmanagement.user.User;
import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "user_profiles")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(
            name = "user_id",
            nullable = false,
            unique = true
    )
    private User user;

    @Column(length = 500)
    private String bio;

    @Column(length = 255)
    private String university;

    @Column(length = 255)
    private String department;

    @Column(name = "avatar_url", length = 500)
    private String avatarUrl;

    @ElementCollection
    @CollectionTable(
            name = "user_profile_skills",
            joinColumns = @JoinColumn(name = "profile_id")
    )
    @Column(name = "skill")
    @Builder.Default
    private List<String> skills = new ArrayList<>();

    @ElementCollection
    @CollectionTable(
            name = "user_profile_tags",
            joinColumns = @JoinColumn(name = "profile_id")
    )
    @Column(name = "tag")
    @Builder.Default
    private List<String> tags = new ArrayList<>();


}