package com.badr.teamprojectmanagement.user;

import com.badr.teamprojectmanagement.common.enums.UserRole;
import com.badr.teamprojectmanagement.user.profile.UserProfile;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.JoinType;
import jakarta.persistence.criteria.ListJoin;
import org.springframework.data.jpa.domain.Specification;

public final class UserSpecification {

    private UserSpecification() {
    }

    public static Specification<User> keyword(String keyword) {

        if (keyword == null || keyword.isBlank()) {
            return null;
        }

        String search = "%" + keyword.trim().toLowerCase() + "%";

        return (root, query, cb) ->
                cb.or(
                        cb.like(
                                cb.lower(root.get("firstName")),
                                search
                        ),
                        cb.like(
                                cb.lower(root.get("lastName")),
                                search
                        ),
                        cb.like(
                                cb.lower(root.get("email")),
                                search
                        )
                );
    }

    public static Specification<User> hasRole(UserRole role) {

        if (role == null) {
            return null;
        }

        return (root, query, cb) ->
                cb.equal(root.get("role"), role);
    }

    public static Specification<User> isVerified(Boolean verified) {

        if (verified == null) {
            return null;
        }

        return (root, query, cb) ->
                cb.equal(root.get("verified"), verified);
    }

    public static Specification<User> isBanned(Boolean banned) {

        if (banned == null) {
            return null;
        }

        return (root, query, cb) ->
                cb.equal(root.get("banned"), banned);
    }

    public static Specification<User> skill(String skill) {

        if (skill == null || skill.isBlank()) {
            return null;
        }

        String search = "%" + skill.trim().toLowerCase() + "%";

        return (root, query, cb) -> {

            query.distinct(true);

            Join<User, UserProfile> profile =
                    root.join("profile", JoinType.LEFT);

            ListJoin<UserProfile, String> skills =
                    profile.joinList("skills", JoinType.LEFT);

            return cb.like(
                    cb.lower(skills),
                    search
            );
        };
    }

    public static Specification<User> tag(String tag) {

        if (tag == null || tag.isBlank()) {
            return null;
        }

        String search = "%" + tag.trim().toLowerCase() + "%";

        return (root, query, cb) -> {

            query.distinct(true);

            Join<User, UserProfile> profile =
                    root.join("profile", JoinType.LEFT);

            ListJoin<UserProfile, String> tags =
                    profile.joinList("tags", JoinType.LEFT);

            return cb.like(
                    cb.lower(tags),
                    search
            );
        };
    }
}