import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Globe2, Lock } from "lucide-react";

import { useSpace } from "@/hooks/useSpaces";

export default function SpaceDetailsPage() {
  const { spaceId } = useParams<{ spaceId: string }>();

  const { data: space, isLoading, isError } = useSpace(spaceId!);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-32 animate-pulse rounded-lg bg-muted" />
        <div className="h-40 animate-pulse rounded-2xl bg-muted" />
        <div className="h-8 w-40 animate-pulse rounded-lg bg-muted" />
      </div>
    );
  }

  if (isError || !space) {
    return (
      <div className="flex min-h-80 flex-col items-center justify-center text-center">
        <h2 className="text-xl font-semibold">Space not found</h2>

        <p className="mt-2 text-sm text-muted-foreground">
          This space may not exist or you may not have permission to view it.
        </p>

        <Link
          to="/spaces"
          className="mt-5 flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition hover:bg-primary/90"
        >
          <ArrowLeft className="size-4" />
          Back to Spaces
        </Link>
      </div>
    );
  }

  const isPublic = space.visibility === "PUBLIC";

  return (
    <div className="space-y-8">
      {/* Back */}
      <Link
        to="/spaces"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground transition hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Back to Spaces
      </Link>

      {/* Space Header */}
      <section className="relative overflow-hidden rounded-2xl border border-border bg-card">
        {/* Gradient */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-primary/10" />

        <div className="relative p-6 md:p-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                {isPublic ? (
                  <Globe2 className="size-6" />
                ) : (
                  <Lock className="size-6" />
                )}
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <h1 className="text-2xl font-bold md:text-3xl">
                    {space.name}
                  </h1>

                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${
                      isPublic
                        ? "bg-primary/10 text-primary"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {isPublic ? (
                      <Globe2 className="size-3" />
                    ) : (
                      <Lock className="size-3" />
                    )}

                    {isPublic ? "Public" : "Private"}
                  </span>
                </div>

                <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
                  {space.description || "No description provided."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Projects */}
      <section>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold">Projects</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Projects inside this space.
            </p>
          </div>
        </div>

        <div className="mt-5 flex min-h-48 items-center justify-center rounded-2xl border border-dashed border-border">
          <p className="text-sm text-muted-foreground">
            Projects will appear here.
          </p>
        </div>
      </section>
    </div>
  );
}
