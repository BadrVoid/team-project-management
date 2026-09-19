import { ArrowLeft, Edit, Trash2, Users } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

import { useTeam } from "@/hooks/useTeams";

export default function TeamDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: team, isLoading, isError } = useTeam(id ?? "");

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  if (isError || !team) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center text-center">
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-destructive/10">
          <Users className="h-7 w-7 text-destructive" />
        </div>

        <h2 className="text-lg font-semibold">Team not found</h2>

        <p className="mt-1 text-sm text-muted-foreground">
          This team may have been deleted or you don't have access to it.
        </p>

        <button
          type="button"
          onClick={() => navigate("/workspace")}
          className="mt-5 rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:opacity-90"
        >
          Back to Workspace
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="button"
          onClick={() => navigate(`/projects/${team.projectId}`)}
          className="flex w-fit items-center gap-2 text-sm text-muted-foreground transition hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Project
        </button>

        <div className="flex items-center gap-2">
          <button
            type="button"
            className="flex items-center gap-2 rounded-xl border border-border px-3 py-2 text-sm font-medium transition hover:bg-muted"
          >
            <Edit className="h-4 w-4" />
            <span className="hidden sm:inline">Edit Team</span>
          </button>

          <button
            type="button"
            className="flex items-center gap-2 rounded-xl border border-destructive/30 px-3 py-2 text-sm font-medium text-destructive transition hover:bg-destructive/10"
          >
            <Trash2 className="h-4 w-4" />
            <span className="hidden sm:inline">Delete</span>
          </button>
        </div>
      </div>

      {/* Team Header */}
      <section className="rounded-2xl border border-border bg-background p-6">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-primary/10">
            <Users className="h-8 w-8 text-primary" />
          </div>

          <div className="min-w-0">
            <h1 className="text-2xl font-bold tracking-tight">{team.name}</h1>

            <p className="mt-2 text-sm text-muted-foreground">
              {team.description || "No description provided."}
            </p>
          </div>
        </div>
      </section>

      {/* Team Members */}
      <section className="rounded-2xl border border-border bg-background p-6">
        <div className="mb-5">
          <h2 className="text-lg font-semibold">Team Members</h2>

          <p className="mt-1 text-sm text-muted-foreground">
            People working in this team.
          </p>
        </div>

        <div className="flex min-h-[180px] items-center justify-center rounded-xl border border-dashed border-border">
          <div className="text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
              <Users className="h-5 w-5 text-primary" />
            </div>

            <p className="mt-3 text-sm font-medium">No members yet</p>

            <p className="mt-1 text-xs text-muted-foreground">
              Team member management will appear here.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
