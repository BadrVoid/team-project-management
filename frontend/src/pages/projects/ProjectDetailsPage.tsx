import { useState } from "react";

import {
  ArrowLeft,
  CalendarDays,
  Edit,
  FolderKanban,
  Plus,
  Trash2,
  User,
  UserPlus,
  Users,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

import { CreateTeamDialog } from "@/components/teams/CreateTeamDialog";
import { DeleteProjectDialog } from "@/components/projects/DeleteProjectDialog";
import { EditProjectDialog } from "@/components/projects/EditProjectDialog";
import { InviteMemberDialog } from "@/components/projects/InviteMemberDialog";
import { useProjectDetails } from "@/hooks/useProjects";

export default function ProjectDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [isCreateTeamOpen, setIsCreateTeamOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isInviteMemberOpen, setIsInviteMemberOpen] = useState(false);

  const { data: project, isLoading, isError } = useProjectDetails(id ?? "");

  /* Loading */
  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="size-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  /* Error */
  if (isError || !project) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center gap-4">
        <div className="max-w-sm rounded-2xl border border-destructive/20 bg-destructive/5 p-6 text-center">
          <h2 className="text-lg font-semibold text-destructive">
            Project not found
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            We couldn't load this project.
          </p>
        </div>

        <button
          type="button"
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
      {/* Page Actions */}
      <div className="flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="group flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-0.5" />
          Back
        </button>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsEditOpen(true)}
            className="flex items-center gap-2 rounded-xl border border-border bg-card px-3 py-2 text-sm font-medium transition-colors hover:bg-muted"
          >
            <Edit className="size-4" />
            <span className="hidden sm:inline">Edit</span>
          </button>

          <button
            type="button"
            onClick={() => setIsDeleteOpen(true)}
            aria-label="Delete project"
            title="Delete project"
            className="flex size-9 items-center justify-center rounded-xl border border-destructive/20 bg-destructive/5 text-destructive transition-colors hover:bg-destructive/10"
          >
            <Trash2 className="size-4" />
          </button>
        </div>
      </div>

      {/* Project Hero */}
      <section className="overflow-hidden rounded-2xl border border-border bg-card">
        <div className="p-6 sm:p-8">
          <div className="flex items-start gap-4">
            <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-primary/10">
              <FolderKanban className="size-7 text-primary" />
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="truncate text-2xl font-semibold tracking-tight sm:text-3xl">
                  {project.name}
                </h1>

                <StatusBadge status={project.status} />
              </div>

              <p className="mt-2 text-sm text-muted-foreground">Project</p>
            </div>
          </div>

          <div className="mt-7 border-t border-border pt-6">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground/70">
              Description
            </p>

            <p className="max-w-3xl text-sm leading-6 text-muted-foreground">
              {project.description || "No description provided."}
            </p>
          </div>
        </div>
      </section>

      {/* Project Information */}
      <section>
        <SectionHeader
          title="Project Information"
          description="Important details about this project."
        />

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <InfoCard
            icon={<CalendarDays className="size-5" />}
            label="Start Date"
            value={formatDate(project.startDate)}
          />

          <InfoCard
            icon={<CalendarDays className="size-5" />}
            label="End Date"
            value={formatDate(project.endDate)}
          />

          <InfoCard
            icon={<User className="size-5" />}
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
      <section className="rounded-2xl border border-border bg-card p-5 sm:p-6">
        <SectionHeader
          title="Members"
          description="People working on this project."
          action={
            <button
              type="button"
              onClick={() => setIsInviteMemberOpen(true)}
              className="flex items-center gap-2 rounded-xl bg-primary px-3 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
            >
              <UserPlus className="size-4" />
              <span className="hidden sm:inline">Invite Member</span>
            </button>
          }
        />

        {project.members.length === 0 ? (
          <EmptyState
            icon={<Users className="size-5" />}
            message="No members yet."
            description="Invite people to start working on this project."
          />
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {project.members.map((member) => (
              <div
                key={member.id}
                className="flex items-center gap-3 rounded-xl border border-border p-4 transition-colors hover:bg-muted/50"
              >
                <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
                  <User className="size-5 text-primary" />
                </div>

                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">
                    {member.firstName} {member.lastName}
                  </p>

                  <div className="mt-1 flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">
                      {member.role}
                    </span>

                    <span className="text-muted-foreground/50">•</span>

                    <MemberStatus status={member.status} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Teams */}
      <section className="rounded-2xl border border-border bg-card p-5 sm:p-6">
        <SectionHeader
          title="Teams"
          description="Teams working on this project."
          action={
            <button
              type="button"
              onClick={() => setIsCreateTeamOpen(true)}
              className="flex items-center gap-2 rounded-xl bg-primary px-3 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
            >
              <Plus className="size-4" />
              <span className="hidden sm:inline">Create Team</span>
            </button>
          }
        />

        {project.teams.length === 0 ? (
          <EmptyState
            icon={<Users className="size-5" />}
            message="No teams yet."
            description="Create a team to organize project members."
          />
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {project.teams.map((team) => (
              <button
                key={team.id}
                type="button"
                onClick={() => navigate(`/teams/${team.id}`)}
                className="group w-full rounded-xl border border-border p-4 text-left transition-all hover:border-primary/30 hover:bg-muted/50"
              >
                <div className="flex items-center gap-3">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                    <Users className="size-5 text-primary" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold transition-colors group-hover:text-primary">
                      {team.name}
                    </p>

                    {team.description && (
                      <p className="mt-1 truncate text-xs text-muted-foreground">
                        {team.description}
                      </p>
                    )}
                  </div>

                  <ArrowLeft className="size-4 rotate-180 text-muted-foreground/0 transition-all group-hover:translate-x-0.5 group-hover:text-muted-foreground" />
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
   Components
========================= */

function SectionHeader({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-5 flex items-start justify-between gap-4">
      <div>
        <h2 className="text-lg font-semibold tracking-tight">{title}</h2>

        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      </div>

      {action}
    </div>
  );
}

function StatusBadge({ status }: { status?: string }) {
  const styles: Record<string, string> = {
    PLANNING: "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400",
    ACTIVE: "bg-blue-500/10 text-blue-700 dark:text-blue-400",
    COMPLETED: "bg-green-500/10 text-green-700 dark:text-green-400",
    ARCHIVED: "bg-muted text-muted-foreground",
  };

  return (
    <span
      className={`rounded-full px-2.5 py-1 text-xs font-medium ${
        (status && styles[status]) ?? "bg-muted text-muted-foreground"
      }`}
    >
      {status ? status.replaceAll("_", " ") : "UNKNOWN"}
    </span>
  );
}

function MemberStatus({ status }: { status?: string }) {
  const styles: Record<string, string> = {
    ACCEPTED: "text-green-600 dark:text-green-400",
    PENDING: "text-yellow-600 dark:text-yellow-400",
    REJECTED: "text-red-600 dark:text-red-400",
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
    <div className="rounded-xl border border-border bg-card p-4 transition-colors hover:bg-muted/30">
      <div className="mb-3 flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
        {icon}
      </div>

      <p className="text-xs text-muted-foreground">{label}</p>

      <p className="mt-1 truncate text-sm font-medium">{value}</p>
    </div>
  );
}

function EmptyState({
  icon,
  message,
  description,
}: {
  icon: React.ReactNode;
  message: string;
  description: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border px-6 py-10 text-center">
      <div className="mb-3 flex size-10 items-center justify-center rounded-xl bg-muted text-muted-foreground">
        {icon}
      </div>

      <p className="text-sm font-medium">{message}</p>

      <p className="mt-1 max-w-sm text-xs text-muted-foreground">
        {description}
      </p>
    </div>
  );
}

function formatDate(date?: string | null) {
  if (!date) return "Not set";

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) {
    return "Invalid Date";
  }

  return parsed.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
