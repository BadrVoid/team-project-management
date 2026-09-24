import { useState } from "react";

import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Edit,
  FolderKanban,
  Plus,
  Trash2,
  User,
  UserPlus,
  Users,
  UsersRound,
} from "lucide-react";

import { useNavigate, useParams } from "react-router-dom";

import { useProjectDetails } from "@/hooks/useProjects";
import { useInviteMember } from "@/hooks/useProjectMembers";

import { CreateTeamDialog } from "@/components/teams/CreateTeamDialog";
import { DeleteProjectDialog } from "@/components/projects/DeleteProjectDialog";
import { EditProjectDialog } from "@/components/projects/EditProjectDialog";
import { InviteMemberDialog } from "@/components/members/InviteMemberDialog";

import { useAuth } from "@/context/AuthContext";
import { getUserIdFromToken } from "@/utils/jwt";
import { isProjectManager, isProjectOwner } from "@/utils/permissions";

export default function ProjectDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { accessToken } = useAuth();

  const { data: project, isLoading, isError } = useProjectDetails(id ?? "");

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [isCreateTeamOpen, setIsCreateTeamOpen] = useState(false);

  const currentUserId = getUserIdFromToken(accessToken);

  const currentUserMembership = project?.members.find(
    (member) => member.userId === currentUserId && member.status === "ACCEPTED",
  );

  const currentUserRole = currentUserMembership?.role;

  const inviteMember = useInviteMember(id ?? "");

  const canEditProject = isProjectManager(currentUserRole);
  const canDeleteProject = isProjectOwner(currentUserRole);
  const canManageMembers = isProjectManager(currentUserRole);
  const canCreateTeam = isProjectManager(currentUserRole);

  const goToWorkspace = () => {
    navigate("/workspace");
  };

  if (isLoading) {
    return <ProjectDetailsSkeleton />;
  }

  if (isError || !project) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
        <div className="flex size-14 items-center justify-center rounded-2xl bg-muted">
          <FolderKanban className="size-7 text-muted-foreground" />
        </div>

        <h2 className="mt-5 text-xl font-bold tracking-tight">
          Project not found
        </h2>

        <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">
          This project may not exist, or you might not have permission to view
          it.
        </p>

        <button
          type="button"
          onClick={goToWorkspace}
          className="mt-5 inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:bg-primary/90 active:scale-[0.98]"
        >
          <ArrowLeft className="size-4" />
          Back to Workspace
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-10">
      {/* Breadcrumb / Back */}
      <div className="flex items-center gap-2 text-sm">
        <button
          type="button"
          onClick={goToWorkspace}
          className="group inline-flex items-center gap-2 font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-4 transition-transform duration-200 group-hover:-translate-x-1" />
          Workspace
        </button>

        <span className="text-muted-foreground/40">/</span>

        <span className="truncate font-medium text-foreground">
          {project.name}
        </span>
      </div>

      {/* Project Hero */}
      <section className="overflow-hidden rounded-3xl border border-border/80 bg-card shadow-sm">
        <div className="p-6 sm:p-8">
          <div className="flex flex-col gap-6">
            {/* Header */}
            <div className="flex items-start gap-4">
              <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <FolderKanban className="size-7" />
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-3">
                  <h1 className="min-w-0 break-words text-2xl font-bold tracking-tight sm:text-3xl">
                    {project.name}
                  </h1>

                  <StatusBadge status={project.status} />
                </div>

                <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
                  {project.description || "No description provided."}
                </p>
              </div>

              {/* Desktop actions */}
              {(canEditProject || canDeleteProject) && (
                <ProjectActions
                  canEdit={canEditProject}
                  canDelete={canDeleteProject}
                  onEdit={() => setIsEditOpen(true)}
                  onDelete={() => setIsDeleteOpen(true)}
                />
              )}
            </div>

            {/* Dates */}
            {(project.startDate || project.endDate) && (
              <div className="flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-border pt-5">
                {project.startDate && (
                  <ProjectDate label="Start" date={project.startDate} />
                )}

                {project.endDate && (
                  <ProjectDate label="End" date={project.endDate} />
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Members */}
      <section className="space-y-5">
        <SectionHeader
          icon={<Users className="size-5" />}
          title="Members"
          description="People working on this project."
          action={
            canManageMembers ? (
              <button
                type="button"
                onClick={() => setIsInviteOpen(true)}
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:bg-primary/90 active:scale-[0.98]"
              >
                <UserPlus className="size-4" />
                <span className="hidden sm:inline">Invite Member</span>
                <span className="sm:hidden">Invite</span>
              </button>
            ) : undefined
          }
        />

        {project.members.length === 0 ? (
          <EmptyState
            icon={<Users className="size-5" />}
            message="No members yet"
            description={
              canManageMembers
                ? "Invite people to start working on this project."
                : "There are no members in this project yet."
            }
            action={
              canManageMembers ? (
                <button
                  type="button"
                  onClick={() => setIsInviteOpen(true)}
                  className="mt-4 inline-flex items-center gap-2 rounded-xl border border-border px-4 py-2 text-sm font-medium transition-colors hover:bg-muted"
                >
                  <UserPlus className="size-4" />
                  Invite Member
                </button>
              ) : undefined
            }
          />
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {project.members.map((member) => (
              <MemberCard
                key={member.id}
                name={`${member.firstName} ${member.lastName}`}
                role={member.role}
                status={member.status}
              />
            ))}
          </div>
        )}
      </section>

      {/* Teams */}
      <section className="space-y-5">
        <SectionHeader
          icon={<UsersRound className="size-5" />}
          title="Teams"
          description="Teams working inside this project."
          action={
            canCreateTeam ? (
              <button
                type="button"
                onClick={() => setIsCreateTeamOpen(true)}
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:bg-primary/90 active:scale-[0.98]"
              >
                <Plus className="size-4" />
                <span className="hidden sm:inline">Create Team</span>
                <span className="sm:hidden">Create</span>
              </button>
            ) : undefined
          }
        />

        {project.teams.length === 0 ? (
          <EmptyState
            icon={<UsersRound className="size-5" />}
            message="No teams yet"
            description={
              canCreateTeam
                ? "Create a team to organize project members."
                : "There are no teams in this project yet."
            }
            action={
              canCreateTeam ? (
                <button
                  type="button"
                  onClick={() => setIsCreateTeamOpen(true)}
                  className="mt-4 inline-flex items-center gap-2 rounded-xl border border-border px-4 py-2 text-sm font-medium transition-colors hover:bg-muted"
                >
                  <Plus className="size-4" />
                  Create Team
                </button>
              ) : undefined
            }
          />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {project.teams.map((team) => (
              <button
                key={team.id}
                type="button"
                onClick={() => navigate(`/teams/${team.id}`)}
                className="group flex min-h-36 flex-col rounded-2xl border border-border/80 bg-card p-5 text-left shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <UsersRound className="size-5" />
                  </div>

                  <ArrowRight className="size-4 text-muted-foreground/40 transition-all duration-200 group-hover:translate-x-1 group-hover:text-primary" />
                </div>

                <h3 className="mt-4 font-semibold tracking-tight transition-colors group-hover:text-primary">
                  {team.name}
                </h3>

                <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                  {team.description || "No description provided."}
                </p>
              </button>
            ))}
          </div>
        )}
      </section>

      {/* Dialogs */}
      {canEditProject && (
        <EditProjectDialog
          open={isEditOpen}
          onOpenChange={setIsEditOpen}
          project={project}
        />
      )}

      {canDeleteProject && (
        <DeleteProjectDialog
          open={isDeleteOpen}
          onOpenChange={setIsDeleteOpen}
          project={project}
        />
      )}

      {canManageMembers && (
        <InviteMemberDialog
          open={isInviteOpen}
          onOpenChange={setIsInviteOpen}
          title="Invite Member"
          description="Search for a user and invite them to this project."
          roleOptions={["MANAGER", "MEMBER"]}
          defaultRole="MEMBER"
          onInvite={(userId, role) => {
            inviteMember.mutate(
              { userId, role },
              {
                onSuccess: () => {
                  setIsInviteOpen(false);
                },
              },
            );
          }}
          isPending={inviteMember.isPending}
          isError={inviteMember.isError}
        />
      )}

      {canCreateTeam && (
        <CreateTeamDialog
          open={isCreateTeamOpen}
          onOpenChange={setIsCreateTeamOpen}
          projectId={project.id}
        />
      )}
    </div>
  );
}

/* =========================
   Project Actions
========================= */

function ProjectActions({
  canEdit,
  canDelete,
  onEdit,
  onDelete,
}: {
  canEdit: boolean;
  canDelete: boolean;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="flex shrink-0 items-center gap-2">
      {canEdit && (
        <button
          type="button"
          onClick={onEdit}
          title="Edit project"
          aria-label="Edit project"
          className="inline-flex size-9 items-center justify-center rounded-xl border border-border text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
        >
          <Edit className="size-4" />
        </button>
      )}

      {canDelete && (
        <button
          type="button"
          onClick={onDelete}
          title="Delete project"
          aria-label="Delete project"
          className="inline-flex size-9 items-center justify-center rounded-xl border border-destructive/30 text-destructive transition-colors hover:bg-destructive/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-destructive/40"
        >
          <Trash2 className="size-4" />
        </button>
      )}
    </div>
  );
}

/* =========================
   Member Card
========================= */

function MemberCard({
  name,
  role,
  status,
}: {
  name: string;
  role?: string;
  status?: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-border/80 bg-card p-4 transition-all duration-200 hover:border-primary/30 hover:shadow-sm">
      <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
        <User className="size-5" />
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold">{name}</p>

        <div className="mt-1 flex items-center gap-2 text-xs">
          <span className="truncate text-muted-foreground">
            {formatLabel(role)}
          </span>

          {status && (
            <>
              <span className="text-muted-foreground/40">•</span>
              <MemberStatus status={status} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/* =========================
   Section Header
========================= */

function SectionHeader({
  icon,
  title,
  description,
  action,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-primary">{icon}</span>

          <h2 className="text-xl font-bold tracking-tight">{title}</h2>
        </div>

        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      </div>

      {action}
    </div>
  );
}

/* =========================
   Project Date
========================= */

function ProjectDate({ label, date }: { label: string; date: string }) {
  return (
    <div className="flex items-center gap-2 text-sm">
      <CalendarDays className="size-4 text-muted-foreground" />

      <span className="text-muted-foreground">{label}</span>

      <span className="font-medium">{formatDate(date)}</span>
    </div>
  );
}

/* =========================
   Status
========================= */

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
      {formatLabel(status) || "Unknown"}
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
    <span className={styles[status ?? ""] ?? "text-muted-foreground"}>
      {formatLabel(status) || "Unknown"}
    </span>
  );
}

/* =========================
   Empty State
========================= */

function EmptyState({
  icon,
  message,
  description,
  action,
}: {
  icon: React.ReactNode;
  message: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex min-h-36 flex-col items-center justify-center rounded-2xl border border-dashed border-border/80 bg-muted/10 p-6 text-center">
      <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
        {icon}
      </div>

      <h3 className="mt-3 text-sm font-semibold">{message}</h3>

      <p className="mt-1 max-w-sm text-sm text-muted-foreground">
        {description}
      </p>

      {action}
    </div>
  );
}

/* =========================
   Loading
========================= */

function ProjectDetailsSkeleton() {
  return (
    <div className="space-y-8 animate-pulse">
      <div className="h-5 w-32 rounded-lg bg-muted" />

      <div className="overflow-hidden rounded-3xl border border-border/50 p-6 sm:p-8">
        <div className="flex gap-4">
          <div className="size-14 shrink-0 rounded-2xl bg-muted" />

          <div className="flex-1 space-y-3">
            <div className="h-8 w-56 rounded-lg bg-muted" />
            <div className="h-4 w-full max-w-xl rounded-lg bg-muted" />
            <div className="h-4 w-3/4 max-w-lg rounded-lg bg-muted" />
          </div>
        </div>

        <div className="mt-6 h-px bg-muted" />

        <div className="mt-5 h-4 w-64 rounded-lg bg-muted" />
      </div>

      <div className="space-y-4">
        <div className="h-6 w-28 rounded-lg bg-muted" />

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <div className="h-20 rounded-2xl bg-muted" />
          <div className="h-20 rounded-2xl bg-muted" />
          <div className="h-20 rounded-2xl bg-muted" />
        </div>
      </div>

      <div className="space-y-4">
        <div className="h-6 w-24 rounded-lg bg-muted" />

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="h-36 rounded-2xl bg-muted" />
          <div className="h-36 rounded-2xl bg-muted" />
          <div className="h-36 rounded-2xl bg-muted" />
        </div>
      </div>
    </div>
  );
}

/* =========================
   Helpers
========================= */

function formatLabel(value?: string | null) {
  if (!value) {
    return "";
  }

  return value
    .toLowerCase()
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function formatDate(date?: string | null) {
  if (!date) {
    return "Not set";
  }

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
