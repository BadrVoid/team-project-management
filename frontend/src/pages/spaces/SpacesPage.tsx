import { useMemo, useState } from "react";
import {
  AlertCircle,
  Globe2,
  Lock,
  Plus,
  Search,
  Sparkles,
  X,
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

type VisibilityFilter = "ALL" | "PUBLIC" | "PRIVATE";

export default function SpacesPage() {
  const { data: spaces = [], isLoading, isError, refetch } = useSpaces();

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<VisibilityFilter>("ALL");

  const [createOpen, setCreateOpen] = useState(false);
  const [editingSpace, setEditingSpace] = useState<SpaceResponse | null>(null);
  const [deletingSpace, setDeletingSpace] = useState<SpaceResponse | null>(
    null,
  );

  const publicSpaces = useMemo(
    () => spaces.filter((space) => space.visibility === "PUBLIC").length,
    [spaces],
  );

  const privateSpaces = useMemo(
    () => spaces.filter((space) => space.visibility === "PRIVATE").length,
    [spaces],
  );

  const filteredSpaces = useMemo(() => {
    const query = search.trim().toLowerCase();

    return spaces.filter((space) => {
      const matchesSearch =
        !query ||
        space.name.toLowerCase().includes(query) ||
        space.description?.toLowerCase().includes(query);

      const matchesFilter =
        filter === "ALL" ||
        (filter === "PUBLIC" && space.visibility === "PUBLIC") ||
        (filter === "PRIVATE" && space.visibility === "PRIVATE");

      return matchesSearch && matchesFilter;
    });
  }, [spaces, search, filter]);

  return (
    <div className="space-y-6 pb-10">
      {/* Integrated Header Banner with Search & Filters */}
      <section className="relative overflow-hidden rounded-3xl border border-border bg-card/60 p-6 sm:p-8 backdrop-blur-md shadow-sm">
        {/* Glow accent */}
        <div className="pointer-events-none absolute -right-20 -top-20 size-80 rounded-full bg-primary/10 blur-3xl" />

        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex-1 space-y-4">
            {/* Title & Badge Row */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                <Sparkles className="size-3.5" />
                <span>Workspace</span>
              </div>

              <button
                type="button"
                onClick={() => setCreateOpen(true)}
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground shadow-sm transition-all hover:bg-primary/90 active:scale-95 lg:hidden"
              >
                <Plus className="size-4" />
                Create Space
              </button>
            </div>

            <div>
              <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                Spaces
              </h1>
              <p className="mt-1 max-w-xl text-sm text-muted-foreground">
                Organize your projects, teams, and tasks into dedicated spaces.
              </p>
            </div>

            {/* Embedded Search Bar & Filter Controls */}
            {!isLoading && spaces.length > 0 && (
              <div className="pt-2 flex flex-col gap-3 sm:flex-row sm:items-center">
                {/* Search Bar Input */}
                <div className="relative flex-1 max-w-md">
                  <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="search"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search spaces..."
                    className="h-10 w-full rounded-xl border border-border/80 bg-background/80 pl-10 pr-9 text-sm outline-none transition-all placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                  {search && (
                    <button
                      type="button"
                      onClick={() => setSearch("")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-muted-foreground hover:text-foreground"
                    >
                      <X className="size-3.5" />
                    </button>
                  )}
                </div>

                {/* Visibility Filter Segment Buttons */}
                <div className="flex items-center rounded-xl border border-border/80 bg-background/60 p-1">
                  <button
                    type="button"
                    onClick={() => setFilter("ALL")}
                    className={`rounded-lg px-3 py-1 text-xs font-medium transition-all ${
                      filter === "ALL"
                        ? "bg-card text-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    All ({spaces.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setFilter("PUBLIC")}
                    className={`flex items-center gap-1.5 rounded-lg px-3 py-1 text-xs font-medium transition-all ${
                      filter === "PUBLIC"
                        ? "bg-sky-500/15 text-sky-600 dark:text-sky-400 shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <Globe2 className="size-3" />
                    Public ({publicSpaces})
                  </button>
                  <button
                    type="button"
                    onClick={() => setFilter("PRIVATE")}
                    className={`flex items-center gap-1.5 rounded-lg px-3 py-1 text-xs font-medium transition-all ${
                      filter === "PRIVATE"
                        ? "bg-slate-500/15 text-slate-700 dark:text-slate-300 shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <Lock className="size-3" />
                    Private ({privateSpaces})
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Desktop Create Action & 3D Visual */}
          <div className="hidden lg:flex lg:flex-col lg:items-end lg:gap-4 shrink-0">
            <button
              type="button"
              onClick={() => setCreateOpen(true)}
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground shadow-sm transition-all hover:bg-primary/90 active:scale-95"
            >
              <Plus className="size-4" />
              Create Space
            </button>
            <Spaces3D />
          </div>
        </div>
      </section>

      {/* Main Grid Content */}
      {isLoading && <SpacesSkeleton />}

      {!isLoading && isError && (
        <div className="flex flex-col items-center justify-center rounded-3xl border border-destructive/20 bg-destructive/5 px-6 py-16 text-center">
          <div className="flex size-12 items-center justify-center rounded-full bg-destructive/10">
            <AlertCircle className="size-6 text-destructive" />
          </div>
          <h2 className="mt-4 text-lg font-semibold">Failed to load spaces</h2>
          <p className="mt-2 max-w-md text-sm text-muted-foreground">
            Something went wrong while fetching your workspaces.
          </p>
          <button
            type="button"
            onClick={() => refetch()}
            className="mt-5 rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            Try Again
          </button>
        </div>
      )}

      {!isLoading && !isError && spaces.length === 0 && <EmptySpaces />}

      {!isLoading &&
        !isError &&
        spaces.length > 0 &&
        filteredSpaces.length === 0 && (
          <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-border px-6 py-16 text-center bg-card/30">
            <div className="flex size-12 items-center justify-center rounded-full bg-muted">
              <Search className="size-5 text-muted-foreground" />
            </div>
            <h2 className="mt-4 text-lg font-semibold">
              No matching spaces found
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              No spaces match your active filters.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setFilter("ALL");
              }}
              className="mt-5 rounded-xl border border-border bg-card px-4 py-2 text-sm font-medium hover:bg-muted"
            >
              Clear Search & Filters
            </button>
          </div>
        )}

      {!isLoading && !isError && filteredSpaces.length > 0 && (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {filteredSpaces.map((space) => (
            <SpaceCard
              key={space.id}
              space={space}
              onEdit={setEditingSpace}
              onDelete={setDeletingSpace}
            />
          ))}
        </div>
      )}

      {/* Dialog Modals */}
      <CreateSpaceDialog open={createOpen} onOpenChange={setCreateOpen} />

      <EditSpaceDialog
        open={!!editingSpace}
        onOpenChange={(open) => !open && setEditingSpace(null)}
        space={editingSpace}
      />

      <DeleteSpaceDialog
        open={!!deletingSpace}
        onOpenChange={(open) => !open && setDeletingSpace(null)}
        space={deletingSpace}
      />
    </div>
  );
}
