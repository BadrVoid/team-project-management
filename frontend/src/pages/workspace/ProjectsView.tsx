import { useQueries, useQuery } from "@tanstack/react-query";
import { ArrowRight, CalendarDays, FolderKanban, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { getMySpaces } from "@/api/apis/spaces.api";
import { getProjectsBySpace } from "@/api/apis/projects.api";
import type { ProjectResponse } from "@/api/types";

export default function ProjectsView() {
  const navigate = useNavigate();

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
          <ProjectCard
            key={project.id}
            project={project}
            onClick={() => navigate(`/projects/${project.id}`)}
          />
        ))}
      </div>
    </div>
  );
}

/*
   Project Card */

function ProjectCard({
  project,
  onClick,
}: {
  project: ProjectResponse;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="
        group
        w-full
        rounded-2xl
        border
        border-border
        bg-background
        p-5
        text-left
        shadow-sm
        transition-all
        duration-200
        hover:-translate-y-0.5
        hover:border-primary/30
        hover:bg-muted/20
        hover:shadow-md
        focus-visible:outline-none
        focus-visible:ring-2
        focus-visible:ring-primary/50
      "
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
          <FolderKanban className="h-5 w-5 text-primary" />
        </div>

        <div className="flex items-center gap-2">
          <span className="rounded-full bg-muted px-2.5 py-1 text-xs font-medium">
            {formatStatus(project.status)}
          </span>

          <ArrowRight
            className="
              h-4
              w-4
              shrink-0
              text-muted-foreground
              transition-all
              duration-200
              group-hover:translate-x-0.5
              group-hover:text-primary
            "
          />
        </div>
      </div>

      <h3 className="mt-4 line-clamp-1 font-semibold">{project.name}</h3>

      <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
        {project.description || "No description provided."}
      </p>

      <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground">
        {project.startDate ? (
          <span className="flex items-center gap-1.5">
            <CalendarDays className="h-3.5 w-3.5" />
            Start: {formatDate(project.startDate)}
          </span>
        ) : (
          <span>No start date</span>
        )}

        {project.endDate && <span>Due: {formatDate(project.endDate)}</span>}
      </div>
    </button>
  );
}

/*
   Helpers */

function formatStatus(status: ProjectResponse["status"]) {
  return status
    .replace("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

/*
   Loading */

function LoadingState() {
  return (
    <div className="flex min-h-60 items-center justify-center rounded-2xl border border-border">
      <Loader2 className="h-6 w-6 animate-spin text-primary" />
    </div>
  );
}

/*
   Error */

function ErrorState({ message }: { message: string }) {
  return (
    <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-10 text-center">
      <p className="text-sm font-medium">{message}</p>
    </div>
  );
}

/*
   Empty */

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
