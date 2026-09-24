import { useMemo, useState } from "react";
import {
  AlertCircle,
  ArrowUpDown,
  Compass,
  FolderLock,
  Globe2,
  Lock,
  Plus,
  Search,
  Sparkles,
  X,
} from "lucide-react";

import type { SpaceResponse } from "@/api/types";
import { CreateSpaceDialog } from "@/components/spaces/CreateSpaceDialog";
import { DeleteSpaceDialog } from "@/components/spaces/DeleteSpaceDialog";
import { EditSpaceDialog } from "@/components/spaces/EditSpaceDialog";
import { EmptySpaces } from "@/components/spaces/EmptySpaces";
import { SpaceCard } from "@/components/spaces/SpaceCard";
import Spaces3D from "@/components/spaces/Space3D";
import { SpacesSkeleton } from "@/components/spaces/SpacesSkeleton";

import { useSpaces } from "@/hooks/useSpaces";

type MainTab = "my-spaces" | "discover";
type VisibilityFilter = "ALL" | "PUBLIC" | "PRIVATE";
type SortOption = "updated" | "name" | "visibility";

export default function SpacesPage() {
  const { data: spaces = [], isLoading, isError, refetch } = useSpaces();

  // Navigation & Filter States
  const [activeTab, setActiveTab] = useState<MainTab>("my-spaces");
  const [search, setSearch] = useState("");
  const [visibilityFilter, setVisibilityFilter] =
    useState<VisibilityFilter>("ALL");
  const [sortBy, setSortBy] = useState<SortOption>("updated");

  // Dialog States
  const [createOpen, setCreateOpen] = useState(false);
  const [editingSpace, setEditingSpace] = useState<SpaceResponse | null>(null);
  const [deletingSpace, setDeletingSpace] = useState<SpaceResponse | null>(
    null,
  );

  // Compute metrics in a single pass
  const { publicSpacesCount, privateSpacesCount } = useMemo(() => {
    let pub = 0;
    let priv = 0;
    for (const space of spaces) {
      if (space.visibility === "PUBLIC") pub++;
      else if (space.visibility === "PRIVATE") priv++;
    }
    return { publicSpacesCount: pub, privateSpacesCount: priv };
  }, [spaces]);

  // Discover spaces (Public spaces available for discovery)
  const discoverSpaces = useMemo(() => {
    return spaces.filter((s) => s.visibility === "PUBLIC");
  }, [spaces]);

  // Filtered and Sorted list for "My Spaces"
  const filteredMySpaces = useMemo(() => {
    const query = search.trim().toLowerCase();

    const filtered = spaces.filter((space) => {
      const matchesSearch =
        !query ||
        space.name.toLowerCase().includes(query) ||
        space.description?.toLowerCase().includes(query);

      const matchesVisibility =
        visibilityFilter === "ALL" || space.visibility === visibilityFilter;

      return matchesSearch && matchesVisibility;
    });

    // Sorting without mutating and optimized date comparison
    return filtered.sort((a, b) => {
      if (sortBy === "name") {
        return a.name.localeCompare(b.name);
      }
      if (sortBy === "visibility") {
        return a.visibility.localeCompare(b.visibility);
      }
      // ISO 8601 strings can be compared lexicographically without Date object creation
      const dateA = a.updatedAt ?? "";
      const dateB = b.updatedAt ?? "";
      return dateB.localeCompare(dateA);
    });
  }, [spaces, search, visibilityFilter, sortBy]);

  // Filtered list for "Discover"
  const filteredDiscoverSpaces = useMemo(() => {
    const query = search.trim().toLowerCase();
    return discoverSpaces.filter((space) => {
      return (
        !query ||
        space.name.toLowerCase().includes(query) ||
        space.description?.toLowerCase().includes(query)
      );
    });
  }, [discoverSpaces, search]);

  const hasActiveFilters = search.trim() !== "" || visibilityFilter !== "ALL";

  const handleResetFilters = () => {
    setSearch("");
    setVisibilityFilter("ALL");
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Hero Header */}
      <section className="relative overflow-hidden rounded-3xl border border-border/80 bg-gradient-to-b from-card/80 to-card/40 p-6 sm:p-8 backdrop-blur-md shadow-sm">
        <div className="pointer-events-none absolute -right-20 -top-20 size-80 rounded-full bg-primary/10 blur-3xl" />

        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex-1 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                <Sparkles className="size-3.5" />
                <span>Workspace Hub</span>
              </div>

              <button
                type="button"
                onClick={() => setCreateOpen(true)}
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground shadow-sm transition-all hover:bg-primary/90 active:scale-95 lg:hidden"
              >
                <Plus className="size-4" />
                New Space
              </button>
            </div>

            <div>
              <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                Spaces
              </h1>
              <p className="mt-1 max-w-xl text-sm text-muted-foreground">
                Manage your personal workspaces or discover open community
                projects to join.
              </p>
            </div>

            {/* Navigation Tabs (My Spaces vs Discover) */}
            <div className="flex items-center gap-2 pt-2 border-b border-border/60">
              <button
                type="button"
                onClick={() => setActiveTab("my-spaces")}
                className={`relative flex items-center gap-2 pb-3 text-sm font-medium transition-colors ${
                  activeTab === "my-spaces"
                    ? "text-primary font-semibold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <FolderLock className="size-4" />
                My Spaces
                <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary">
                  {spaces.length}
                </span>
                {activeTab === "my-spaces" && (
                  <span className="absolute bottom-0 left-0 h-0.5 w-full rounded-full bg-primary" />
                )}
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("discover")}
                className={`relative flex items-center gap-2 pb-3 text-sm font-medium transition-colors ${
                  activeTab === "discover"
                    ? "text-primary font-semibold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Compass className="size-4" />
                Discover
                <span className="rounded-full bg-sky-500/10 px-2 py-0.5 text-xs text-sky-500">
                  {discoverSpaces.length}
                </span>
                {activeTab === "discover" && (
                  <span className="absolute bottom-0 left-0 h-0.5 w-full rounded-full bg-primary" />
                )}
              </button>
            </div>
          </div>

          {/* Desktop Call To Action & Visual */}
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

      {/* Control Bar (Search, Filters, Sort) */}
      {!isLoading && !isError && spaces.length > 0 && (
        <div className="flex flex-col gap-4 rounded-2xl border border-border/60 bg-card/40 p-4 backdrop-blur-sm sm:flex-row sm:items-center sm:justify-between">
          {/* Search Bar */}
          <div className="relative flex-1 max-w-md">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={
                activeTab === "my-spaces"
                  ? "Search my spaces..."
                  : "Search public spaces to join..."
              }
              className="h-10 w-full rounded-xl border border-border/80 bg-background/80 pl-10 pr-9 text-sm outline-none transition-all placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
            {search && (
              <button
                type="button"
                aria-label="Clear search"
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-muted-foreground hover:text-foreground"
              >
                <X className="size-3.5" />
              </button>
            )}
          </div>

          {/* Tab Specific Controls */}
          <div className="flex flex-wrap items-center gap-3">
            {activeTab === "my-spaces" && (
              /* Visibility Selector */
              <div className="flex items-center rounded-xl border border-border/80 bg-background/60 p-1">
                <button
                  type="button"
                  onClick={() => setVisibilityFilter("ALL")}
                  className={`rounded-lg px-3 py-1 text-xs font-medium transition-all ${
                    visibilityFilter === "ALL"
                      ? "bg-card text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  All ({spaces.length})
                </button>
                <button
                  type="button"
                  onClick={() => setVisibilityFilter("PUBLIC")}
                  className={`flex items-center gap-1.5 rounded-lg px-3 py-1 text-xs font-medium transition-all ${
                    visibilityFilter === "PUBLIC"
                      ? "bg-sky-500/15 text-sky-600 dark:text-sky-400 shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Globe2 className="size-3" />
                  Public ({publicSpacesCount})
                </button>
                <button
                  type="button"
                  onClick={() => setVisibilityFilter("PRIVATE")}
                  className={`flex items-center gap-1.5 rounded-lg px-3 py-1 text-xs font-medium transition-all ${
                    visibilityFilter === "PRIVATE"
                      ? "bg-slate-500/15 text-slate-700 dark:text-slate-300 shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Lock className="size-3" />
                  Private ({privateSpacesCount})
                </button>
              </div>
            )}

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2 rounded-xl border border-border/80 bg-background/60 px-3 py-1.5 text-xs text-muted-foreground">
              <ArrowUpDown className="size-3.5 text-muted-foreground" />
              <span>Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="bg-transparent font-medium text-foreground outline-none cursor-pointer"
              >
                <option value="updated">Recently Updated</option>
                <option value="name">Name (A-Z)</option>
                <option value="visibility">Visibility</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Active Filter Chips */}
      {hasActiveFilters && (
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Active filters:</span>
          {search && (
            <span className="inline-flex items-center gap-1 rounded-full border border-border bg-muted/50 px-2.5 py-0.5 text-xs">
              "{search}"
              <button
                type="button"
                onClick={() => setSearch("")}
                aria-label="Remove search filter"
              >
                <X className="size-3 text-muted-foreground hover:text-foreground" />
              </button>
            </span>
          )}
          {visibilityFilter !== "ALL" && (
            <span className="inline-flex items-center gap-1 rounded-full border border-border bg-muted/50 px-2.5 py-0.5 text-xs capitalize">
              {visibilityFilter.toLowerCase()}
              <button
                type="button"
                onClick={() => setVisibilityFilter("ALL")}
                aria-label="Reset visibility filter"
              >
                <X className="size-3 text-muted-foreground hover:text-foreground" />
              </button>
            </span>
          )}
          <button
            type="button"
            onClick={handleResetFilters}
            className="text-xs text-primary underline-offset-4 hover:underline"
          >
            Clear all
          </button>
        </div>
      )}

      {/* Loading Skeleton */}
      {isLoading && <SpacesSkeleton />}

      {/* Error State */}
      {!isLoading && isError && (
        <div className="flex flex-col items-center justify-center rounded-3xl border border-destructive/20 bg-destructive/5 px-6 py-16 text-center">
          <div className="flex size-12 items-center justify-center rounded-full bg-destructive/10">
            <AlertCircle className="size-6 text-destructive" />
          </div>
          <h2 className="mt-4 text-lg font-semibold">Failed to load spaces</h2>
          <p className="mt-2 max-w-md text-sm text-muted-foreground">
            Something went wrong while fetching workspaces.
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

      {/* Zero State for My Spaces */}
      {!isLoading &&
        !isError &&
        activeTab === "my-spaces" &&
        spaces.length === 0 && <EmptySpaces />}

      {/* Tab 1: My Spaces View */}
      {!isLoading &&
        !isError &&
        activeTab === "my-spaces" &&
        spaces.length > 0 && (
          <>
            {filteredMySpaces.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-border px-6 py-16 text-center bg-card/30">
                <div className="flex size-12 items-center justify-center rounded-full bg-muted">
                  <Search className="size-5 text-muted-foreground" />
                </div>
                <h2 className="mt-4 text-lg font-semibold">
                  No matching spaces found
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Try refining your search terms or clearing active filters.
                </p>
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="mt-5 rounded-xl border border-border bg-card px-4 py-2 text-sm font-medium hover:bg-muted"
                >
                  Clear Search & Filters
                </button>
              </div>
            ) : (
              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {filteredMySpaces.map((space) => (
                  <SpaceCard
                    key={space.id}
                    space={space}
                    onEdit={setEditingSpace}
                    onDelete={setDeletingSpace}
                  />
                ))}
              </div>
            )}
          </>
        )}

      {/* Tab 2: Discover View */}
      {!isLoading && !isError && activeTab === "discover" && (
        <>
          {filteredDiscoverSpaces.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-border px-6 py-16 text-center bg-card/30">
              <div className="flex size-12 items-center justify-center rounded-full bg-muted">
                <Compass className="size-5 text-muted-foreground" />
              </div>
              <h2 className="mt-4 text-lg font-semibold">
                No public spaces to discover
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                There are currently no public spaces matching your search.
              </p>
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="mt-5 rounded-xl border border-border bg-card px-4 py-2 text-sm font-medium hover:bg-muted"
                >
                  Clear Search
                </button>
              )}
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {filteredDiscoverSpaces.map((space) => (
                <SpaceCard
                  key={space.id}
                  space={space}
                  onEdit={setEditingSpace}
                  onDelete={setDeletingSpace}
                />
              ))}
            </div>
          )}
        </>
      )}

      {/* Modals */}
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
