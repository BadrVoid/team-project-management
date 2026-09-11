package com.badr.teamprojectmanagement.project;

import com.badr.teamprojectmanagement.project.dtos.ProjectDetailsResponse;
import com.badr.teamprojectmanagement.project.dtos.ProjectMemberResponse;
import com.badr.teamprojectmanagement.project.dtos.ProjectResponse;
import com.badr.teamprojectmanagement.team.Team;
import com.badr.teamprojectmanagement.team.dtos.TeamSummaryResponse;
import com.badr.teamprojectmanagement.user.User;
import com.badr.teamprojectmanagement.user.dtos.UserSummaryResponse;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class ProjectMapper {

    public ProjectResponse toResponse(Project project) {

        return new ProjectResponse(
                project.getId(),
                project.getSpace().getId(),
                project.getName(),
                project.getDescription(),
                project.getStatus(),
                project.getStartDate(),
                project.getEndDate(),
                project.getCreatedBy().getId()
        );
    }

    public ProjectDetailsResponse toDetailsResponse(
            Project project,
            List<ProjectMemberResponse> members,
            List<TeamSummaryResponse> teams
    ) {

        User creator = project.getCreatedBy();

        UserSummaryResponse createdBy =
                new UserSummaryResponse(
                        creator.getId(),
                        creator.getFirstName(),
                        creator.getLastName()
                );

        return new ProjectDetailsResponse(
                project.getId(),
                project.getName(),
                project.getDescription(),
                project.getStatus(),
                project.getStartDate(),
                project.getEndDate(),
                createdBy,
                members,
                teams
        );
    }

    public ProjectMemberResponse toMemberResponse(
            ProjectMember member
    ) {

        User user = member.getUser();

        return new ProjectMemberResponse(
                member.getId(),
                user.getId(),
                user.getFirstName(),
                user.getLastName(),
                member.getRole(),
                member.getStatus()
        );
    }

    public TeamSummaryResponse toTeamSummaryResponse(
            Team team
    ) {

        return new TeamSummaryResponse(
                team.getId(),
                team.getName(),
                team.getDescription()
        );
    }
}