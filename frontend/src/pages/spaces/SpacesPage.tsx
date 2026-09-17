import { useMemo, useState } from "react";

import {
  AlertCircle,
  Globe2,
  Lock,
  Plus,
  Search,
  Sparkles,
} from "lucide-react";
import Spaces3D from "@/components/spaces/Space3D";
import type { SpaceResponse } from "@/api/types";

import { useSpaces } from "@/hooks/useSpaces";

import { SpaceCard } from "@/components/spaces/SpaceCard";
import { CreateSpaceDialog } from "@/components/spaces/CreateSpaceDialog";
import { EditSpaceDialog } from "@/components/spaces/EditSpaceDialog";
import { DeleteSpaceDialog } from "@/components/spaces/DeleteSpaceDialog";
import { SpacesSkeleton } from "@/components/spaces/SpacesSkeleton";
import { EmptySpaces } from "@/components/spaces/EmptySpaces";

export default function SpacesPage() {
  const { data: spaces = [], isLoading, isError, refetch } = useSpaces();

  const [search, setSearch] = useState("");

  const [createOpen, setCreateOpen] = useState(false);

  const [editingSpace, setEditingSpace] = useState<SpaceResponse | null>(null);

  const [deletingSpace, setDeletingSpace] = useState<SpaceResponse | null>(
    null,
  );

  const filteredSpaces = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return spaces;
    }

    return spaces.filter((space) => {
      return (
        space.name.toLowerCase().includes(query) ||
        space.description?.toLowerCase().includes(query)
      );
    });
  }, [spaces, search]);

  const publicSpaces = spaces.filter(
    (space) => space.visibility === "PUBLIC",
  ).length;

  const privateSpaces = spaces.filter(
    (space) => space.visibility === "PRIVATE",
  ).length;

  const handleEdit = (space: SpaceResponse) => {
    setEditingSpace(space);
  };

  const handleDelete = (space: SpaceResponse) => {
    setDeletingSpace(space);
  };

  const handleCreateOpen = () => {
    setCreateOpen(true);
  };

  const handleCreateClose = (open: boolean) => {
    setCreateOpen(open);
  };

  const handleEditClose = (open: boolean) => {
    if (!open) {
      setEditingSpace(null);
    }
  };

  const handleDeleteClose = (open: boolean) => {
    if (!open) {
      setDeletingSpace(null);
    }
  };

  return (
    <>
      <div className="space-y-8">
        {/* Header */}
        <div className="relative overflow-hidden rounded-3xl border border-border bg-card">
          {/* Background glow */}
          <div className="pointer-events-none absolute -right-24 -top-24 size-64 rounded-full bg-primary/10 blur-3xl" />

          <div className="relative flex flex-col gap-8 p-6 sm:p-8 lg:flex-row lg:items-center lg:justify-between">
            {/* Content */}
            <div className="max-w-2xl">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-primary">
                  Workspace
                </span>
              </div>

              <h1 className="mt-2 text-3xl font-bold ">Spaces</h1>

              <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground sm:text-base">
                Organize your projects, teams, and tasks into dedicated spaces.
              </p>

              <button
                type="button"
                onClick={handleCreateOpen}
                className="mt-6 flex w-fit items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-medium text-primary-foreground shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-primary/90 hover:shadow-md"
              >
                <Plus className="size-4" />
                Create Space
              </button>
            </div>

            {/* CSS 3D Visual */}
            <div className="hidden lg:block">
              <Spaces3D />
            </div>
          </div>
        </div>

        {/* Stats */}
        {!isLoading && !isError && spaces.length > 0 && (
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-border bg-card p-5 transition-colors hover:border-primary/20">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">Total Spaces</p>

                <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Sparkles className="size-4" />
                </div>
              </div>

              <p className="mt-3 text-2xl font-bold">{spaces.length}</p>
            </div>

            <div className="rounded-2xl border border-border bg-card p-5 transition-colors hover:border-primary/20">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">Public</p>

                <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Globe2 className="size-4" />
                </div>
              </div>

              <p className="mt-3 text-2xl font-bold text-primary">
                {publicSpaces}
              </p>
            </div>

            <div className="rounded-2xl border border-border bg-card p-5 transition-colors hover:border-primary/20">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">Private</p>

                <div className="flex size-9 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                  <Lock className="size-4" />
                </div>
              </div>

              <p className="mt-3 text-2xl font-bold">{privateSpaces}</p>
            </div>
          </div>
        )}

        {/* Search */}
        {!isLoading && spaces.length > 0 && (
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative w-full max-w-md">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search spaces..."
                className="h-11 w-full rounded-xl border border-border bg-background pl-10 pr-10 text-sm outline-none transition-all placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
              />

              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground transition-colors hover:text-foreground"
                >
                  Clear
                </button>
              )}
            </div>

            <p className="text-sm text-muted-foreground">
              {filteredSpaces.length}{" "}
              {filteredSpaces.length === 1 ? "space" : "spaces"}
            </p>
          </div>
        )}

        {/* Loading */}
        {isLoading && <SpacesSkeleton />}

        {/* Error */}
        {!isLoading && isError && (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-destructive/20 bg-destructive/5 px-6 py-16 text-center">
            <div className="flex size-12 items-center justify-center rounded-full bg-destructive/10">
              <AlertCircle className="size-6 text-destructive" />
            </div>

            <h2 className="mt-4 text-lg font-semibold">
              Failed to load spaces
            </h2>

            <p className="mt-2 max-w-md text-sm text-muted-foreground">
              Something went wrong while loading your spaces. Please try again.
            </p>

            <button
              type="button"
              onClick={() => refetch()}
              className="mt-5 rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition hover:bg-primary/90"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Empty */}
        {!isLoading && !isError && spaces.length === 0 && <EmptySpaces />}

        {/* No Search Results */}
        {!isLoading &&
          !isError &&
          spaces.length > 0 &&
          filteredSpaces.length === 0 && (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border px-6 py-16 text-center">
              <div className="flex size-12 items-center justify-center rounded-full bg-muted">
                <Search className="size-5 text-muted-foreground" />
              </div>

              <h2 className="mt-4 text-lg font-semibold">No spaces found</h2>

              <p className="mt-2 max-w-md text-sm text-muted-foreground">
                No spaces match "{search}".
              </p>

              <button
                type="button"
                onClick={() => setSearch("")}
                className="mt-5 rounded-xl border border-border px-4 py-2.5 text-sm font-medium transition hover:bg-muted"
              >
                Clear Search
              </button>
            </div>
          )}

        {/* Spaces */}
        {!isLoading && !isError && filteredSpaces.length > 0 && (
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {filteredSpaces.map((space) => (
              <SpaceCard
                key={space.id}
                space={space}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>

      {/* Create */}
      <CreateSpaceDialog open={createOpen} onOpenChange={handleCreateClose} />

      {/* Edit */}
      <EditSpaceDialog
        open={!!editingSpace}
        onOpenChange={handleEditClose}
        space={editingSpace}
      />

      {/* Delete */}
      <DeleteSpaceDialog
        open={!!deletingSpace}
        onOpenChange={handleDeleteClose}
        space={deletingSpace}
      />
    </>
  );
}
