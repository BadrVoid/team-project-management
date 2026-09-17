import { useMemo, useState } from "react";

import { Compass, Globe2, Search, Users } from "lucide-react";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useJoinSpace, usePublicSpaces } from "@/hooks/useSpaces";

export default function PublicSpacesPage() {
  const [search, setSearch] = useState("");

  const { data: spaces = [], isLoading, isError } = usePublicSpaces();

  const joinMutation = useJoinSpace();

  const filteredSpaces = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return spaces;
    }

    return spaces.filter(
      (space) =>
        space.name.toLowerCase().includes(query) ||
        space.description?.toLowerCase().includes(query),
    );
  }, [spaces, search]);

  const totalSpaces = spaces.length;

  const memberSpaces = spaces.filter(
    (space) =>
      space.membershipStatus === "MEMBER" || space.membershipStatus === "OWNER",
  ).length;

  const pendingSpaces = spaces.filter(
    (space) => space.membershipStatus === "PENDING",
  ).length;

  return (
    <div className="space-y-8">
      {/* Header */}
      <section className="relative overflow-hidden rounded-2xl border border-border bg-card">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-primary/10" />

        <div className="relative flex flex-col gap-6 p-6 md:flex-row md:items-center md:justify-between md:p-8">
          <div className="flex items-start gap-4">
            <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <Compass className="size-7" />
            </div>

            <div>
              <h1 className="text-2xl font-bold md:text-3xl">
                Discover Spaces
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
                Explore public spaces, find communities, and join spaces that
                interest you.
              </p>
            </div>
          </div>

          {/* Stats */}
          {!isLoading && !isError && (
            <div className="flex shrink-0 gap-3">
              <div className="rounded-xl border border-border bg-background/60 px-4 py-3 text-center">
                <p className="text-lg font-semibold">{totalSpaces}</p>
                <p className="text-xs text-muted-foreground">Public</p>
              </div>

              <div className="rounded-xl border border-border bg-background/60 px-4 py-3 text-center">
                <p className="text-lg font-semibold">{memberSpaces}</p>
                <p className="text-xs text-muted-foreground">Joined</p>
              </div>

              {pendingSpaces > 0 && (
                <div className="rounded-xl border border-border bg-background/60 px-4 py-3 text-center">
                  <p className="text-lg font-semibold">{pendingSpaces}</p>
                  <p className="text-xs text-muted-foreground">Pending</p>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Search */}
      <div className="relative max-w-xl">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

        <Input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search public spaces..."
          className="h-11 pl-9"
        />
      </div>

      {/* Loading */}
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

      {/* Error */}
      {isError && (
        <div className="flex min-h-64 flex-col items-center justify-center rounded-2xl border border-destructive/20 bg-destructive/5 px-6 text-center">
          <Globe2 className="size-10 text-destructive/60" />

          <h2 className="mt-4 text-lg font-semibold">
            Unable to load public spaces
          </h2>

          <p className="mt-2 text-sm text-muted-foreground">
            Something went wrong while loading the public spaces.
          </p>
        </div>
      )}

      {/* Empty */}
      {!isLoading && !isError && spaces.length === 0 && (
        <div className="flex min-h-72 flex-col items-center justify-center rounded-2xl border border-dashed border-border px-6 text-center">
          <div className="flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <Globe2 className="size-6" />
          </div>

          <h2 className="mt-4 text-lg font-semibold">No public spaces yet</h2>

          <p className="mt-2 max-w-md text-sm text-muted-foreground">
            There are no public spaces available right now.
          </p>
        </div>
      )}

      {/* No Search Results */}
      {!isLoading &&
        !isError &&
        spaces.length > 0 &&
        filteredSpaces.length === 0 && (
          <div className="flex min-h-64 flex-col items-center justify-center rounded-2xl border border-dashed border-border px-6 text-center">
            <Search className="size-10 text-muted-foreground/50" />

            <h2 className="mt-4 text-lg font-semibold">No spaces found</h2>

            <p className="mt-2 text-sm text-muted-foreground">
              Try searching with a different name or description.
            </p>
          </div>
        )}

      {/* Spaces */}
      {!isLoading && !isError && filteredSpaces.length > 0 && (
        <section>
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">Public Spaces</h2>

              <p className="mt-1 text-sm text-muted-foreground">
                {filteredSpaces.length}{" "}
                {filteredSpaces.length === 1 ? "space" : "spaces"} available
              </p>
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {filteredSpaces.map((space) => (
              <div
                key={space.id}
                className="group relative overflow-hidden rounded-2xl border border-border bg-card transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-xl"
              >
                {/* Hover Gradient */}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-primary/20 via-primary/5 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                <div className="relative p-6">
                  {/* Top */}
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        <Globe2 className="size-5" />
                      </div>

                      <div className="min-w-0">
                        <h3 className="truncate text-lg font-semibold">
                          {space.name}
                        </h3>

                        <span className="mt-1.5 inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-1 text-[11px] font-medium text-primary">
                          <Globe2 className="size-3" />
                          Public
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="mt-5 min-h-12 line-clamp-2 text-sm leading-6 text-muted-foreground">
                    {space.description || "No description provided."}
                  </p>

                  {/* Footer */}
                  <div className="mt-6 flex items-center justify-between border-t border-border pt-4">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
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
                      {/* Open */}
                      <Button
                        asChild
                        variant="ghost"
                        size="sm"
                        className="text-primary hover:bg-primary/10 hover:text-primary"
                      >
                        <Link to={`/spaces/${space.id}`}>Open</Link>
                      </Button>

                      {/* Join */}
                      {space.membershipStatus === "NONE" && (
                        <Button
                          type="button"
                          size="sm"
                          onClick={() => joinMutation.mutate(space.id)}
                          disabled={
                            joinMutation.isPending &&
                            joinMutation.variables === space.id
                          }
                        >
                          {joinMutation.isPending &&
                          joinMutation.variables === space.id
                            ? "Joining..."
                            : "Join Space"}
                        </Button>
                      )}

                      {/* Pending */}
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

                      {/* Member */}
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

                      {/* Owner */}
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
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
