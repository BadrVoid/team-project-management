import { useQueries, useQuery } from "@tanstack/react-query";
import { FolderKanban, Loader2 } from "lucide-react";

import { getMySpaces } from "@/api/apis/spaces.api";
import { getProjectsBySpace } from "@/api/apis/projects.api";
import type { ProjectResponse } from "@/api/types";

export default function ProjectsView() {
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

  const isLoading =
    spacesLoading || projectQueries.some((query) => query.isLoading);

  const isError = spacesError || projectQueries.some((query) => query.isError);

  const projects: ProjectResponse[] = projectQueries.flatMap(
    (query) => query.data ?? [],
  );

  if (isLoading) {
    return <LoadingState />;
  }

  if (isError) {
    return <ErrorState message="Failed to load your projects." />;
  }

  if (projects.length === 0) {
    return (
      <EmptyState
        icon={<FolderKanban className="h-10 w-10" />}
        title="No projects yet"
        description="Projects you create or join will appear here."
      />
    );
  }

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-lg font-semibold">Projects</h2>

        <p className="mt-1 text-sm text-muted-foreground">
          All projects you are working on.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </div>
  );
}

function ProjectCard({ project }: { project: ProjectResponse }) {
  return (
    <div className="rounded-2xl border border-border bg-background p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
          <FolderKanban className="h-5 w-5 text-primary" />
        </div>

        <span className="rounded-full bg-muted px-2.5 py-1 text-xs font-medium">
          {formatStatus(project.status)}
        </span>
      </div>

      <h3 className="mt-4 line-clamp-1 font-semibold">{project.name}</h3>

      <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
        {project.description || "No description provided."}
      </p>

      <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
        {project.startDate ? (
          <span>Start: {formatDate(project.startDate)}</span>
        ) : (
          <span>No start date</span>
        )}

        {project.endDate && <span>Due: {formatDate(project.endDate)}</span>}
      </div>
    </div>
  );
}

function formatStatus(status: ProjectResponse["status"]) {
  return status
    .replace("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString();
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
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-dashed border-border p-10 text-center">
      <div className="mx-auto flex w-fit text-muted-foreground">{icon}</div>

      <p className="mt-3 text-sm font-medium">{title}</p>

      <p className="mt-1 text-sm text-muted-foreground">{description}</p>
    </div>
  );
}
