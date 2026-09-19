import { useQueries, useQuery } from "@tanstack/react-query";
import { FolderKanban, Loader2, Users } from "lucide-react";

import { getMySpaces } from "@/api/apis/spaces.api";
import { getProjectsBySpace } from "@/api/apis/projects.api";
import { getTeamsByProject } from "@/api/apis/teams.api";
import type { ProjectResponse, TeamSummaryResponse } from "@/api/types";

interface TeamWithProject extends TeamSummaryResponse {
  projectName: string;
}

export default function TeamsView() {
  const {
    data: spaces,
    isLoading: spacesLoading,
    isError: spacesError,
  } = useQuery({
    queryKey: ["spaces", "my"],
    queryFn: getMySpaces,
  });

  const projectQueries = useQueries({
    queries:
      spaces?.map((space) => ({
        queryKey: ["projects", "space", space.id],
        queryFn: () => getProjectsBySpace(space.id),
        enabled: !!spaces,
      })) ?? [],
  });

  const projects: ProjectResponse[] = projectQueries.flatMap(
    (query) => query.data ?? [],
  );

  const projectsLoading = projectQueries.some((query) => query.isLoading);

  const projectsError = projectQueries.some((query) => query.isError);

  const teamQueries = useQueries({
    queries: projects.map((project) => ({
      queryKey: ["teams", "project", project.id],
      queryFn: () => getTeamsByProject(project.id),
      enabled: !!project.id,
    })),
  });

  const teams: TeamWithProject[] = teamQueries.flatMap((query, index) => {
    const project = projects[index];

    return (query.data ?? []).map((team) => ({
      ...team,
      projectName: project.name,
    }));
  });

  const teamsLoading = teamQueries.some((query) => query.isLoading);

  const teamsError = teamQueries.some((query) => query.isError);

  const isLoading = spacesLoading || projectsLoading || teamsLoading;

  const isError = spacesError || projectsError || teamsError;

  if (isLoading) {
    return <LoadingState />;
  }

  if (isError) {
    return <ErrorState message="Failed to load your teams." />;
  }

  if (teams.length === 0) {
    return (
      <EmptyState
        title="No teams yet"
        description="Teams from your projects will appear here."
      />
    );
  }

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-lg font-semibold">Teams</h2>

        <p className="mt-1 text-sm text-muted-foreground">
          All teams across your projects.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {teams.map((team) => (
          <TeamCard key={team.id} team={team} />
        ))}
      </div>
    </div>
  );
}

function TeamCard({ team }: { team: TeamWithProject }) {
  return (
    <div className="rounded-2xl border border-border bg-background p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
        <Users className="h-5 w-5 text-primary" />
      </div>

      <h3 className="mt-4 font-semibold">{team.name}</h3>

      <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
        {team.description || "No description provided."}
      </p>

      <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
        <FolderKanban className="h-3.5 w-3.5" />

        <span className="truncate">{team.projectName}</span>
      </div>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="flex min-h-60 items-center justify-center rounded-2xl border border-border">
      <Loader2 className="h-6 w-6 animate-spin text-primary" />
    </div>
  );
}

function ErrorState({ message }: { message: string }) {
  return (
    <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-10 text-center">
      <p className="text-sm font-medium">{message}</p>
    </div>
  );
}

function EmptyState({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-dashed border-border p-10 text-center">
      <Users className="mx-auto h-10 w-10 text-muted-foreground" />

      <p className="mt-3 text-sm font-medium">{title}</p>

      <p className="mt-1 text-sm text-muted-foreground">{description}</p>
    </div>
  );
}
