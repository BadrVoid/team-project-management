import { useQuery } from "@tanstack/react-query";

import { getMySpaces } from "@/api/apis/spaces.api";
import { getProjectsBySpace } from "@/api/apis/projects.api";
import { getMyTasks, getTasksByTeam } from "@/api/apis/tasks.api";
import { getTeamsByProject } from "@/api/apis/teams.api";
import { getNotifications } from "@/api/apis/notifications.api";

export function useDashboard() {
  const spacesQuery = useQuery({
    queryKey: ["spaces", "my"],
    queryFn: getMySpaces,
  });

  const currentSpace = spacesQuery.data?.[0];

  const projectsQuery = useQuery({
    queryKey: ["projects", "space", currentSpace?.id],
    queryFn: () => getProjectsBySpace(currentSpace!.id),
    enabled: !!currentSpace?.id,
  });

  const tasksQuery = useQuery({
    queryKey: ["tasks", "my"],
    queryFn: getMyTasks,
  });

  const notificationsQuery = useQuery({
    queryKey: ["notifications"],
    queryFn: getNotifications,
  });

  const projectIds = projectsQuery.data?.map((project) => project.id) ?? [];

  const projectTeamsQuery = useQuery({
    queryKey: ["teams", "projects", projectIds],
    queryFn: async () => {
      const results = await Promise.all(
        projectIds.map(async (projectId) => {
          const teams = await getTeamsByProject(projectId);

          return {
            projectId,
            teams,
          };
        }),
      );

      return results;
    },
    enabled: projectIds.length > 0,
  });

  const projectTasksQuery = useQuery({
    queryKey: ["tasks", "projects", projectIds],
    queryFn: async () => {
      const results = await Promise.all(
        projectIds.map(async (projectId) => {
          const teams = await getTeamsByProject(projectId);

          const tasks = await Promise.all(
            teams.map((team) => getTasksByTeam(team.id)),
          );

          return {
            projectId,
            tasks: tasks.flat(),
          };
        }),
      );

      return results;
    },
    enabled: projectIds.length > 0,
  });

  return {
    spaces: spacesQuery.data ?? [],
    currentSpace,

    projects: projectsQuery.data ?? [],

    tasks: tasksQuery.data ?? [],

    projectTeams: projectTeamsQuery.data ?? [],

    projectTasks: projectTasksQuery.data ?? [],

    notifications: notificationsQuery.data ?? [],

    isLoading:
      spacesQuery.isLoading ||
      projectsQuery.isLoading ||
      tasksQuery.isLoading ||
      notificationsQuery.isLoading ||
      projectTeamsQuery.isLoading ||
      projectTasksQuery.isLoading,

    isError:
      spacesQuery.isError ||
      projectsQuery.isError ||
      tasksQuery.isError ||
      notificationsQuery.isError ||
      projectTeamsQuery.isError ||
      projectTasksQuery.isError,
  };
}