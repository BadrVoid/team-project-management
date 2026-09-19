import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  CalendarDays,
  Edit,
  FolderKanban,
  Trash2,
  User,
  Users,
  UserPlus,
  Plus,
} from "lucide-react";
import { useProjectDetails } from "@/hooks/useProjects";
import { CreateTeamDialog } from "@/components/teams/CreateTeamDialog";
import { EditProjectDialog } from "@/components/projects/EditProjectDialog";
import { DeleteProjectDialog } from "@/components/projects/DeleteProjectDialog";
import { InviteMemberDialog } from "@/components/projects/InviteMemberDialog";
export default function ProjectDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isCreateTeamOpen, setIsCreateTeamOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isInviteMemberOpen, setIsInviteMemberOpen] = useState(false);
  const { data: project, isLoading, isError } = useProjectDetails(id ?? "");

  // Handling Loading
  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  // Handling Errors
  if (isError || !project) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center gap-4">
        <div className="rounded-2xl border border-destructive/20 bg-destructive/10 p-6 text-center">
          <h2 className="text-lg font-semibold text-destructive">
            Project not found
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            We couldn't load this project.
          </p>
        </div>

        <button
          onClick={() => navigate("/projects")}
          className="rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:opacity-90"
        >
          Back to Projects
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header Controls */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex w-fit items-center gap-2 text-sm text-muted-foreground transition hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>

        {/* Edit & Delete */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsEditOpen(true)}
            className="flex items-center gap-2 rounded-xl border border-border px-4 py-2 text-sm font-medium transition hover:bg-muted"
          >
            <Edit className="h-4 w-4" />
          </button>

          <button
            onClick={() => setIsDeleteOpen(true)}
            className="flex items-center gap-2 rounded-xl bg-destructive px-4 py-2 text-sm font-medium text-destructive-foreground transition hover:bg-destructive/90"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Project Header */}
      <section className="rounded-2xl border border-border bg-background shadow-sm">
        <div className="p-6">
          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary/10">
              <FolderKanban className="h-7 w-7 text-primary" />
            </div>

            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-2xl font-bold ">{project.name}</h1>

                <StatusBadge status={project.status} />
              </div>

              <p className="mt-2 text-sm text-muted-foreground">Project</p>
            </div>
          </div>

          {/* Description */}
          <div className="mt-8 border-t border-border pt-6">
            <h2 className="mb-3 text-sm font-semibold">Description</h2>

            <p className="text-sm leading-6 text-muted-foreground">
              {project.description || "No description provided."}
            </p>
          </div>
        </div>
      </section>

      {/* Project Information */}
      <section>
        <h2 className="mb-4 text-lg font-semibold">Project Information</h2>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <InfoCard
            icon={<CalendarDays className="h-5 w-5" />}
            label="Start Date"
            value={formatDate(project.startDate)}
          />

          <InfoCard
            icon={<CalendarDays className="h-5 w-5" />}
            label="End Date"
            value={formatDate(project.endDate)}
          />

          <InfoCard
            icon={<User className="h-5 w-5" />}
            label="Created By"
            value={
              `${project.createdBy?.firstName ?? ""} ${
                project.createdBy?.lastName ?? ""
              }`.trim() || "N/A"
            }
          />
        </div>
      </section>

      {/* Members */}
      <section className="rounded-2xl border border-border bg-background p-6">
        <div className="mb-5 flex items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold">Members</h2>

            <p className="mt-1 text-sm text-muted-foreground">
              People working on this project.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsInviteMemberOpen(true)}
              className="flex items-center gap-2 rounded-xl bg-primary px-3 py-2 text-sm font-medium text-primary-foreground transition hover:opacity-90"
            >
              <UserPlus className="h-4 w-4" />
              <span className="hidden sm:inline">Invite Member</span>
            </button>

            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
              <Users className="h-5 w-5 text-primary" />
            </div>
          </div>
        </div>

        {project.members.length === 0 ? (
          <EmptyState message="No members yet." />
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {project.members.map((member) => (
              <div
                key={member.id}
                className="flex items-center gap-3 rounded-xl border border-border p-4 transition hover:bg-muted/50"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
                  <User className="h-5 w-5 text-primary" />
                </div>

                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">
                    {member.firstName} {member.lastName}
                  </p>

                  <div className="mt-1 flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">
                      {member.role}
                    </span>

                    <span className="text-muted-foreground">•</span>

                    <MemberStatus status={member.status} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Teams */}
      <section className="rounded-2xl border border-border bg-background p-6">
        <div className="mb-5 flex items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold">Teams</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Teams working on this project.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsCreateTeamOpen(true)}
              className="flex items-center gap-2 rounded-xl bg-primary px-3 py-2 text-sm font-medium text-primary-foreground transition hover:opacity-90"
            >
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline"> Create Team </span>
            </button>
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
              <Users className="h-5 w-5 text-primary" />
            </div>
          </div>
        </div>
        {project.teams.length === 0 ? (
          <EmptyState message="No teams yet." />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {project.teams.map((team) => (
              <button
                key={team.id}
                type="button"
                onClick={() => navigate(`/teams/${team.id}`)}
                className="w-full rounded-xl border border-border p-4 text-left transition hover:bg-muted/50"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                    <Users className="h-5 w-5 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold">
                      {team.name}
                    </p>
                    {team.description && (
                      <p className="mt-1 truncate text-xs text-muted-foreground">
                        {team.description}
                      </p>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </section>

      {/* Dialogs */}
      <EditProjectDialog
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
        project={project}
      />
      <CreateTeamDialog
        open={isCreateTeamOpen}
        onOpenChange={setIsCreateTeamOpen}
        projectId={project.id}
      />
      <DeleteProjectDialog
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        project={project}
        onDeleted={() => navigate("/spaces")}
      />

      <InviteMemberDialog
        open={isInviteMemberOpen}
        onOpenChange={setIsInviteMemberOpen}
        projectId={project.id}
      />
    </div>
  );
}

/* =========================
   Helpers
========================= */

function StatusBadge({ status }: { status?: string }) {
  const styles: Record<string, string> = {
    PLANNING: "bg-yellow-500/10 text-yellow-600",
    ACTIVE: "bg-blue-500/10 text-blue-600",
    COMPLETED: "bg-green-500/10 text-green-600",
    ARCHIVED: "bg-gray-500/10 text-gray-600",
  };

  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-medium ${
        (status && styles[status]) ?? "bg-muted text-muted-foreground"
      }`}
    >
      {status ? status.replaceAll("_", " ") : "UNKNOWN"}
    </span>
  );
}

function MemberStatus({ status }: { status?: string }) {
  const styles: Record<string, string> = {
    ACCEPTED: "text-green-600",
    PENDING: "text-yellow-600",
    REJECTED: "text-red-600",
  };

  return (
    <span
      className={`text-xs font-medium ${
        (status && styles[status]) ?? "text-muted-foreground"
      }`}
    >
      {status ?? "UNKNOWN"}
    </span>
  );
}

function InfoCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-border bg-background p-5">
      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
        {icon}
      </div>

      <p className="text-xs text-muted-foreground">{label}</p>

      <p className="mt-1 truncate text-sm font-medium">{value}</p>
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="rounded-xl border border-dashed border-border p-8 text-center">
      <p className="text-sm text-muted-foreground">{message}</p>
    </div>
  );
}

function formatDate(date?: string | null) {
  if (!date) return "Not set";

  const parsed = new Date(date);

  if (isNaN(parsed.getTime())) {
    return "Invalid Date";
  }

  return parsed.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
