import { useMemo, useState } from "react";
import { Compass, Globe2, Loader2, Search, Users, X } from "lucide-react";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { useJoinSpace, usePublicSpaces } from "@/hooks/useSpaces";

type StatusFilter = "ALL" | "JOINED" | "AVAILABLE" | "PENDING";

export default function PublicSpacesPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");

  const { data: spaces = [], isLoading, isError } = usePublicSpaces();
  const joinMutation = useJoinSpace();

  const totalSpaces = spaces.length;

  const memberSpaces = useMemo(
    () =>
      spaces.filter(
        (space) =>
          space.membershipStatus === "MEMBER" ||
          space.membershipStatus === "OWNER",
      ).length,
    [spaces],
  );

  const pendingSpaces = useMemo(
    () => spaces.filter((space) => space.membershipStatus === "PENDING").length,
    [spaces],
  );

  const availableSpaces = useMemo(
    () => spaces.filter((space) => space.membershipStatus === "NONE").length,
    [spaces],
  );

  const filteredSpaces = useMemo(() => {
    const query = search.trim().toLowerCase();

    return spaces.filter((space) => {
      const matchesSearch =
        !query ||
        space.name.toLowerCase().includes(query) ||
        space.description?.toLowerCase().includes(query);

      const matchesStatus =
        statusFilter === "ALL" ||
        (statusFilter === "AVAILABLE" && space.membershipStatus === "NONE") ||
        (statusFilter === "JOINED" &&
          (space.membershipStatus === "MEMBER" ||
            space.membershipStatus === "OWNER")) ||
        (statusFilter === "PENDING" && space.membershipStatus === "PENDING");

      return matchesSearch && matchesStatus;
    });
  }, [spaces, search, statusFilter]);

  return (
    <div className="space-y-6 pb-10">
      {/* Integrated Header Banner with Search & Filters */}
      <section className="relative overflow-hidden rounded-3xl border border-border bg-card/60 p-6 backdrop-blur-md shadow-sm sm:p-8">
        {/* Ambient Glow */}
        <div className="pointer-events-none absolute -right-20 -top-20 size-80 rounded-full bg-primary/10 blur-3xl" />

        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex-1 space-y-4">
            {/* Header Title */}
            <div className="flex items-center gap-3">
              <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <Compass className="size-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                  Discover Spaces
                </h1>
                <p className="text-xs text-muted-foreground sm:text-sm">
                  Explore public spaces, find communities, and request access.
                </p>
              </div>
            </div>

            {/* Embedded Search & Status Filter Toolbar */}
            {!isLoading && !isError && spaces.length > 0 && (
              <div className="pt-2 flex flex-col gap-3 sm:flex-row sm:items-center">
                {/* Search Bar Input */}
                <div className="relative flex-1 max-w-md">
                  <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="search"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search public spaces..."
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

                {/* Filter Tabs */}
                <div className="flex flex-wrap items-center rounded-xl border border-border/80 bg-background/60 p-1">
                  <button
                    type="button"
                    onClick={() => setStatusFilter("ALL")}
                    className={`rounded-lg px-3 py-1 text-xs font-medium transition-all ${
                      statusFilter === "ALL"
                        ? "bg-card text-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    All ({totalSpaces})
                  </button>
                  <button
                    type="button"
                    onClick={() => setStatusFilter("AVAILABLE")}
                    className={`rounded-lg px-3 py-1 text-xs font-medium transition-all ${
                      statusFilter === "AVAILABLE"
                        ? "bg-card text-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    Available ({availableSpaces})
                  </button>
                  <button
                    type="button"
                    onClick={() => setStatusFilter("JOINED")}
                    className={`rounded-lg px-3 py-1 text-xs font-medium transition-all ${
                      statusFilter === "JOINED"
                        ? "bg-sky-500/15 text-sky-600 dark:text-sky-400 shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    Joined ({memberSpaces})
                  </button>
                  {pendingSpaces > 0 && (
                    <button
                      type="button"
                      onClick={() => setStatusFilter("PENDING")}
                      className={`rounded-lg px-3 py-1 text-xs font-medium transition-all ${
                        statusFilter === "PENDING"
                          ? "bg-amber-500/15 text-amber-600 dark:text-amber-400 shadow-sm"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      Pending ({pendingSpaces})
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Loading Skeletons */}
      {isLoading && (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="h-56 animate-pulse rounded-2xl border border-border bg-muted/40"
            />
          ))}
        </div>
      )}

      {/* Error State */}
      {isError && (
        <div className="flex min-h-64 flex-col items-center justify-center rounded-3xl border border-destructive/20 bg-destructive/5 px-6 text-center">
          <Globe2 className="size-10 text-destructive/60" />
          <h2 className="mt-4 text-lg font-semibold">
            Unable to load public spaces
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Something went wrong while fetching public spaces.
          </p>
        </div>
      )}

      {/* Empty Database */}
      {!isLoading && !isError && spaces.length === 0 && (
        <div className="flex min-h-72 flex-col items-center justify-center rounded-3xl border border-dashed border-border px-6 text-center bg-card/30">
          <div className="flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <Globe2 className="size-6" />
          </div>
          <h2 className="mt-4 text-lg font-semibold">No public spaces yet</h2>
          <p className="mt-2 max-w-md text-sm text-muted-foreground">
            There are no public spaces available right now.
          </p>
        </div>
      )}

      {/* Search/Filter Empty Results */}
      {!isLoading &&
        !isError &&
        spaces.length > 0 &&
        filteredSpaces.length === 0 && (
          <div className="flex min-h-64 flex-col items-center justify-center rounded-3xl border border-dashed border-border px-6 text-center bg-card/30">
            <Search className="size-10 text-muted-foreground/50" />
            <h2 className="mt-4 text-lg font-semibold">No spaces found</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              No public spaces match your active search or filter.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setStatusFilter("ALL");
              }}
              className="mt-5 rounded-xl border border-border bg-card px-4 py-2 text-sm font-medium hover:bg-muted"
            >
              Clear Search & Filters
            </button>
          </div>
        )}

      {/* Spaces Grid */}
      {!isLoading && !isError && filteredSpaces.length > 0 && (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filteredSpaces.map((space) => {
            const isJoining =
              joinMutation.isPending && joinMutation.variables === space.id;

            return (
              <div
                key={space.id}
                className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-border bg-card transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-xl"
              >
                {/* Hover Gradient Effect */}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-primary/10 via-primary/5 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                <div className="relative p-6">
                  {/* Card Header */}
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-sky-500/10 text-sky-600 dark:text-sky-400">
                        <Globe2 className="size-5" />
                      </div>

                      <div className="min-w-0">
                        <h3 className="truncate text-lg font-semibold">
                          {space.name}
                        </h3>

                        <span className="mt-1 inline-flex items-center gap-1.5 rounded-full border border-sky-500/20 bg-sky-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-sky-700 dark:text-sky-300">
                          <Globe2 className="size-3" />
                          Public
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="mt-4 min-h-12 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                    {space.description || "No description provided."}
                  </p>
                </div>

                {/* Card Footer */}
                <div className="relative flex items-center justify-between border-t border-border/80 bg-muted/20 px-6 py-4">
                  <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                    <Users className="size-3.5" />
                    {space.membershipStatus === "OWNER"
                      ? "Owner"
                      : space.membershipStatus === "MEMBER"
                        ? "Member"
                        : space.membershipStatus === "PENDING"
                          ? "Request pending"
                          : "Public space"}
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-primary hover:bg-primary/10 hover:text-primary"
                    >
                      <Link to={`/spaces/${space.id}`}>Open</Link>
                    </Button>

                    {space.membershipStatus === "NONE" && (
                      <Button
                        type="button"
                        size="sm"
                        onClick={() => joinMutation.mutate(space.id)}
                        disabled={isJoining}
                      >
                        {isJoining && (
                          <Loader2 className="mr-1.5 size-3.5 animate-spin" />
                        )}
                        {isJoining ? "Joining..." : "Join Space"}
                      </Button>
                    )}

                    {space.membershipStatus === "PENDING" && (
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        disabled
                      >
                        Pending
                      </Button>
                    )}

                    {space.membershipStatus === "MEMBER" && (
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        disabled
                      >
                        Joined
                      </Button>
                    )}

                    {space.membershipStatus === "OWNER" && (
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        disabled
                      >
                        Owner
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
