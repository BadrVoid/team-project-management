import { useMemo, useState } from "react";
import { Compass, Globe2, Loader2, Search, Users } from "lucide-react";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { useJoinSpace, usePublicSpaces } from "@/hooks/useSpaces";
import { SpaceSearchToolbar } from "@/components/spaces/SpaceSearchToolbar";

type StatusFilter = "ALL" | "JOINED" | "AVAILABLE" | "PENDING";

export default function PublicSpacesPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");

  const { data: spaces = [], isLoading, isError } = usePublicSpaces();
  const joinMutation = useJoinSpace();

  // Compute status counts in a single pass
  const counts = useMemo(() => {
    let joined = 0;
    let pending = 0;
    let available = 0;

    for (const space of spaces) {
      if (
        space.membershipStatus === "MEMBER" ||
        space.membershipStatus === "OWNER"
      ) {
        joined++;
      } else if (space.membershipStatus === "PENDING") {
        pending++;
      } else if (space.membershipStatus === "NONE") {
        available++;
      }
    }

    return { total: spaces.length, joined, pending, available };
  }, [spaces]);

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
      {/* Header Banner */}
      <section className="relative overflow-hidden rounded-3xl border border-border bg-card/60 p-6 backdrop-blur-md shadow-sm sm:p-8">
        <div className="pointer-events-none absolute -right-20 -top-20 size-80 rounded-full bg-primary/10 blur-3xl" />

        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex-1 space-y-4">
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

            {!isLoading && !isError && spaces.length > 0 && (
              <SpaceSearchToolbar
                search={search}
                onSearchChange={setSearch}
                activeFilter={statusFilter}
                onFilterChange={setStatusFilter}
                filterOptions={[
                  { id: "ALL", label: "All", count: counts.total },
                  {
                    id: "AVAILABLE",
                    label: "Available",
                    count: counts.available,
                  },
                  {
                    id: "JOINED",
                    label: "Joined",
                    count: counts.joined,
                    activeClass:
                      "bg-sky-500/15 text-sky-600 dark:text-sky-400 shadow-sm",
                  },
                  ...(counts.pending > 0
                    ? [
                        {
                          id: "PENDING" as StatusFilter,
                          label: "Pending",
                          count: counts.pending,
                          activeClass:
                            "bg-amber-500/15 text-amber-600 dark:text-amber-400 shadow-sm",
                        },
                      ]
                    : []),
                ]}
              />
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
        <div className="flex min-h-72 flex-col items-center justify-center rounded-3xl border border-dashed border-border bg-card/30 px-6 text-center">
          <div className="flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <Globe2 className="size-6" />
          </div>
          <h2 className="mt-4 text-lg font-semibold">No public spaces yet</h2>
          <p className="mt-2 max-w-md text-sm text-muted-foreground">
            There are no public spaces available right now.
          </p>
        </div>
      )}

      {/* Empty Search/Filter Results */}
      {!isLoading &&
        !isError &&
        spaces.length > 0 &&
        filteredSpaces.length === 0 && (
          <div className="flex min-h-64 flex-col items-center justify-center rounded-3xl border border-dashed border-border bg-card/30 px-6 text-center">
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

      {/* Grid */}
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
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-primary/10 via-primary/5 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                <div className="relative p-6">
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

                  <p className="mt-4 min-h-12 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                    {space.description || "No description provided."}
                  </p>
                </div>

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
                      asChild
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
