import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Globe2,
  Lock,
  Pencil,
  Plus,
  Trash2,
  FolderKanban,
} from "lucide-react";

import { useSpace } from "@/hooks/useSpaces";
import { useProjectsBySpace } from "@/hooks/useProjects";

import type { SpaceResponse } from "@/api/types";

import { EditSpaceDialog } from "@/components/spaces/EditSpaceDialog";
import { DeleteSpaceDialog } from "@/components/spaces/DeleteSpaceDialog";
import { CreateProjectDialog } from "@/components/projects/CreateProjectDialog";

export default function SpaceDetailsPage() {
  const { spaceId } = useParams<{ spaceId: string }>();

  const {
    data: space,
    isLoading: isSpaceLoading,
    isError: isSpaceError,
  } = useSpace(spaceId!);

  const { data: projects = [], isLoading: isProjectsLoading } =
    useProjectsBySpace(spaceId!);

  const [editingSpace, setEditingSpace] = useState<SpaceResponse | null>(null);

  const [deletingSpace, setDeletingSpace] = useState<SpaceResponse | null>(
    null,
  );

  const [createProjectOpen, setCreateProjectOpen] = useState(false);

  if (isSpaceLoading) {
    return (
      <div className="space-y-8 animate-pulse">
        <div className="h-5 w-32 rounded-lg bg-muted" />
        <div className="h-48 rounded-3xl bg-muted" />
        <div className="space-y-4">
          <div className="h-8 w-48 rounded-lg bg-muted" />
          <div className="h-36 rounded-2xl bg-muted" />
        </div>
      </div>
    );
  }

  if (isSpaceError || !space) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center rounded-3xl border border-dashed border-border bg-card/30 p-8 text-center">
        <div className="flex size-14 items-center justify-center rounded-2xl bg-muted">
          <Lock className="size-6 text-muted-foreground" />
        </div>

        <h2 className="mt-4 text-xl font-bold tracking-tight">
          Space not found
        </h2>

        <p className="mt-2 max-w-md text-sm text-muted-foreground">
          This space may not exist, or you might not have permission to view it.
        </p>

        <Link
          to="/spaces"
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-all hover:bg-primary/90 active:scale-95"
        >
          <ArrowLeft className="size-4" />
          Back to Spaces
        </Link>
      </div>
    );
  }

  const isPublic = space.visibility === "PUBLIC";

  return (
    <div className="space-y-8 pb-10">
      {/* Navigation */}
      <Link
        to="/spaces"
        className="group inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4 transition-transform duration-200 group-hover:-translate-x-1" />
        Back to Spaces
      </Link>

      {/* Space Header */}
      <section className="relative overflow-hidden rounded-3xl border border-border/80 bg-card/90 p-6 shadow-sm backdrop-blur-sm sm:p-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <div className="flex items-start gap-4">
            <div
              className={`flex size-14 shrink-0 items-center justify-center rounded-2xl ${
                isPublic
                  ? "bg-sky-500/10 text-sky-600 dark:text-sky-400"
                  : "bg-slate-500/10 text-slate-600 dark:text-slate-400"
              }`}
            >
              {isPublic ? (
                <Globe2 className="size-7" />
              ) : (
                <Lock className="size-7" />
              )}
            </div>

            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                  {space.name}
                </h1>

                <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-muted px-3 py-0.5 text-xs font-semibold text-muted-foreground">
                  {isPublic ? (
                    <Globe2 className="size-3" />
                  ) : (
                    <Lock className="size-3" />
                  )}
                  {isPublic ? "Public Space" : "Private Space"}
                </span>
              </div>

              <p className="max-w-3xl text-sm leading-relaxed text-muted-foreground sm:text-base">
                {space.description || "No description provided for this space."}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start pt-2 md:pt-0">
            <button
              type="button"
              onClick={() => setEditingSpace(space)}
              aria-label="Edit space"
              className="flex size-9 items-center justify-center rounded-xl border border-border bg-card text-muted-foreground transition-all hover:bg-muted hover:text-foreground"
            >
              <Pencil className="size-4" />
            </button>

            <button
              type="button"
              onClick={() => setDeletingSpace(space)}
              aria-label="Delete space"
              className="flex size-9 items-center justify-center rounded-xl border border-border bg-card text-muted-foreground transition-all hover:bg-destructive/10 hover:text-destructive"
            >
              <Trash2 className="size-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Projects */}
      <section className="space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold tracking-tight">Projects</h2>
            <p className="text-sm text-muted-foreground">
              Projects contained within this space.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setCreateProjectOpen(true)}
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:bg-primary/90 active:scale-95"
          >
            <Plus className="size-4" />
            New Project
          </button>
        </div>

        {isProjectsLoading ? (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="h-44 animate-pulse rounded-2xl bg-muted"
              />
            ))}
          </div>
        ) : projects.length === 0 ? (
          <div className="flex min-h-60 flex-col items-center justify-center rounded-3xl border border-dashed border-border/80 bg-card/20 p-8 text-center">
            <div className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <FolderKanban className="size-6" />
            </div>

            <h3 className="mt-4 text-base font-semibold">No projects yet</h3>

            <p className="mt-1 max-w-sm text-sm text-muted-foreground">
              Create your first project inside <strong>{space.name}</strong>.
            </p>

            <button
              type="button"
              onClick={() => setCreateProjectOpen(true)}
              className="mt-5 inline-flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2 text-sm font-medium transition-colors hover:bg-muted"
            >
              <Plus className="size-4" />
              Create Project
            </button>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {projects.map((project) => (
              <Link
                key={project.id}
                to={`/projects/${project.id}`}
                className="group rounded-2xl border border-border/80 bg-card p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md"
              >
                <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <FolderKanban className="size-5" />
                </div>

                <h3 className="mt-4 font-semibold tracking-tight transition-colors group-hover:text-primary">
                  {project.name}
                </h3>

                <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                  {project.description || "No description provided."}
                </p>

                <span className="mt-4 inline-flex rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">
                  {project.status.replaceAll("_", " ")}
                </span>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Dialogs */}
      <EditSpaceDialog
        open={!!editingSpace}
        onOpenChange={(open) => {
          if (!open) setEditingSpace(null);
        }}
        space={editingSpace}
      />

      <DeleteSpaceDialog
        open={!!deletingSpace}
        onOpenChange={(open) => {
          if (!open) setDeletingSpace(null);
        }}
        space={deletingSpace}
      />

      <CreateProjectDialog
        open={createProjectOpen}
        onOpenChange={setCreateProjectOpen}
        spaceId={spaceId!}
      />
    </div>
  );
}
