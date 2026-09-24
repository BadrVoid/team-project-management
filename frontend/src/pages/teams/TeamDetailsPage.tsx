import { useState } from "react";

import { useNavigate, useParams } from "react-router-dom";

import {
  ArrowLeft,
  CalendarDays,
  Edit,
  MoreHorizontal,
  Trash2,
  UserMinus,
  UserPlus,
  Users,
  UsersRound,
} from "lucide-react";

import { useAuth } from "@/context/AuthContext";
import { getUserIdFromToken } from "@/utils/jwt";
import { canDeleteTask, canEditTask, isTeamLeader } from "@/utils/permissions";

import { useTeam } from "@/hooks/useTeams";
import {
  useInviteTeamMember,
  useRemoveTeamMember,
  useTeamMembers,
} from "@/hooks/useTeamMembers";
import { useDeleteTask, useTasksByTeam } from "@/hooks/useTasks";

import { EditTeamDialog } from "@/components/teams/EditTeamDialog";
import { DeleteTeamDialog } from "@/components/teams/DeleteTeamDialog";
import { InviteMemberDialog } from "@/components/members/InviteMemberDialog";
import { RemoveTeamMemberDialog } from "@/components/teams/RemoveTeamMemberDialog";
import { UpdateTeamMemberRoleDialog } from "@/components/teams/UpdateTeamMemberRoleDialog";
import CreateTaskDialog from "@/components/tasks/CreateTasksDialog";
import TaskCard from "@/components/tasks/TaskCard";

import type { TeamMemberResponse } from "@/api/types";

export default function TeamDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { accessToken } = useAuth();

  const { data: team, isLoading: teamLoading } = useTeam(id ?? "");

  const { data: members = [], isLoading: membersLoading } = useTeamMembers(
    id ?? "",
  );

  const { data: tasks = [], isLoading: tasksLoading } = useTasksByTeam(
    id ?? "",
  );

  const inviteMember = useInviteTeamMember(id ?? "");
  const removeMutation = useRemoveTeamMember(id ?? "");
  const deleteTaskMutation = useDeleteTask();

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isInviteOpen, setIsInviteOpen] = useState(false);

  const [selectedMember, setSelectedMember] =
    useState<TeamMemberResponse | null>(null);

  const [isRoleOpen, setIsRoleOpen] = useState(false);
  const [isRemoveOpen, setIsRemoveOpen] = useState(false);

  const currentUserId = getUserIdFromToken(accessToken);

  const currentUserMembership = members.find(
    (member) => member.userId === currentUserId && member.status === "ACCEPTED",
  );

  const isAcceptedMember = !!currentUserMembership;
  const isLeader = isTeamLeader(currentUserMembership?.role);
  const canManageTeam = isLeader;
  const canCreateTask = isAcceptedMember;

  const openRoleDialog = (member: TeamMemberResponse) => {
    setSelectedMember(member);
    setIsRoleOpen(true);
  };

  const openRemoveDialog = (member: TeamMemberResponse) => {
    setSelectedMember(member);
    removeMutation.reset();
    setIsRemoveOpen(true);
  };

  const handleRemove = () => {
    if (!selectedMember) return;

    removeMutation.mutate(selectedMember.userId, {
      onSuccess: () => {
        setIsRemoveOpen(false);
        setSelectedMember(null);
      },
    });
  };

  const handleDeleteTask = async (taskId: string) => {
    await deleteTaskMutation.mutateAsync(taskId);
  };

  if (teamLoading) {
    return <TeamDetailsSkeleton />;
  }

  if (!team) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4">
        <div className="w-full max-w-md rounded-3xl border border-border bg-card p-8 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-muted">
            <Users className="h-6 w-6 text-muted-foreground" />
          </div>

          <h2 className="mt-4 text-lg font-semibold">Team not found</h2>

          <p className="mt-2 text-sm text-muted-foreground">
            This team may have been deleted or you may no longer have access to
            it.
          </p>

          <button
            type="button"
            onClick={() => navigate("/workspace?tab=teams")}
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition hover:opacity-90"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Teams
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm">
        <button
          type="button"
          onClick={() => navigate("/workspace?tab=teams")}
          className="inline-flex items-center gap-1.5 text-muted-foreground transition hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Teams
        </button>

        <span className="text-muted-foreground/50">/</span>

        <span className="max-w-[220px] truncate font-medium text-foreground">
          {team.name}
        </span>
      </div>

      {/* Hero */}
      <section className="overflow-hidden rounded-3xl border border-border bg-card">
        <div className="p-6 sm:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div className="flex min-w-0 items-start gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <UsersRound className="h-7 w-7" />
              </div>

              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="truncate text-2xl font-bold tracking-tight sm:text-3xl">
                    {team.name}
                  </h1>

                  {isLeader && (
                    <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
                      Leader
                    </span>
                  )}
                </div>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
                  {team.description || "No description provided."}
                </p>

                <div className="mt-5 flex flex-wrap items-center gap-3">
                  <InfoPill
                    icon={<Users className="h-3.5 w-3.5" />}
                    label={`${members.length} ${
                      members.length === 1 ? "member" : "members"
                    }`}
                  />

                  <InfoPill
                    icon={<CalendarDays className="h-3.5 w-3.5" />}
                    label={`${tasks.length} ${
                      tasks.length === 1 ? "task" : "tasks"
                    }`}
                  />
                </div>
              </div>
            </div>

            {canManageTeam && (
              <div className="flex shrink-0 items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditOpen(true)}
                  className="inline-flex items-center gap-2 rounded-xl border border-border px-3.5 py-2.5 text-sm font-medium transition hover:bg-muted"
                >
                  <Edit className="h-4 w-4" />
                  <span>Edit Team</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsDeleteOpen(true)}
                  className="inline-flex items-center gap-2 rounded-xl border border-destructive/30 px-3.5 py-2.5 text-sm font-medium text-destructive transition hover:bg-destructive/10"
                >
                  <Trash2 className="h-4 w-4" />
                  <span className="hidden sm:inline">Delete</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Members */}
      <section className="space-y-4">
        <SectionHeader
          icon={<Users className="h-5 w-5" />}
          title="Team Members"
          description="People currently working on this team."
          action={
            isLeader ? (
              <button
                type="button"
                onClick={() => setIsInviteOpen(true)}
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-3.5 py-2.5 text-sm font-medium text-primary-foreground transition hover:opacity-90"
              >
                <UserPlus className="h-4 w-4" />
                <span className="hidden sm:inline">Invite Member</span>
              </button>
            ) : undefined
          }
        />

        {membersLoading ? (
          <MembersSkeleton />
        ) : members.length === 0 ? (
          <EmptyState
            icon={<Users className="h-6 w-6" />}
            title="No members yet"
            description="This team doesn't have any members yet."
          />
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {members.map((member) => {
              const isCurrentUser = member.userId === currentUserId;
              const canManageThisMember = isLeader && !isCurrentUser;

              return (
                <MemberCard
                  key={member.id}
                  member={member}
                  isCurrentUser={isCurrentUser}
                  canManage={canManageThisMember}
                  onChangeRole={() => openRoleDialog(member)}
                  onRemove={() => openRemoveDialog(member)}
                />
              );
            })}
          </div>
        )}
      </section>

      {/* Tasks */}
      <section className="space-y-4">
        <SectionHeader
          icon={<CalendarDays className="h-5 w-5" />}
          title="Tasks"
          description="Tasks assigned to this team."
          action={
            canCreateTask ? (
              <CreateTaskDialog teamId={team.id} members={members} />
            ) : undefined
          }
        />

        {tasksLoading ? (
          <TasksSkeleton />
        ) : tasks.length === 0 ? (
          <EmptyState
            icon={<CalendarDays className="h-6 w-6" />}
            title="No tasks yet"
            description={
              canCreateTask
                ? "Create the first task for this team."
                : "No tasks have been assigned to this team yet."
            }
          />
        ) : (
          <div className="grid gap-4 lg:grid-cols-2">
            {tasks.map((task) => {
              const canEdit = canEditTask(task, currentUserId, isLeader);
              const canDelete = canDeleteTask(task, currentUserId, isLeader);

              return (
                <TaskCard
                  key={task.id}
                  task={task}
                  onEdit={() => {
                    if (canEdit) {
                      navigate(`/tasks/${task.id}`);
                    }
                  }}
                  onDelete={() => {
                    if (canDelete) {
                      void handleDeleteTask(task.id);
                    }
                  }}
                />
              );
            })}
          </div>
        )}
      </section>

      {/* Dialogs */}
      {canManageTeam && (
        <>
          <EditTeamDialog
            open={isEditOpen}
            onOpenChange={setIsEditOpen}
            team={team}
          />

          <DeleteTeamDialog
            open={isDeleteOpen}
            onOpenChange={setIsDeleteOpen}
            team={team}
          />
        </>
      )}

      {isLeader && (
        <>
          <InviteMemberDialog
            open={isInviteOpen}
            onOpenChange={setIsInviteOpen}
            title="Invite Team Member"
            description="Search for a user and invite them to this team."
            roleOptions={["LEADER", "MEMBER"]}
            defaultRole="MEMBER"
            onInvite={(userId, role) => {
              inviteMember.mutate(
                {
                  userId,
                  role,
                },
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

          {selectedMember && (
            <>
              <UpdateTeamMemberRoleDialog
                open={isRoleOpen}
                onOpenChange={setIsRoleOpen}
                member={selectedMember}
                teamId={team.id}
              />

              <RemoveTeamMemberDialog
                open={isRemoveOpen}
                onOpenChange={(open) => {
                  setIsRemoveOpen(open);

                  if (!open) {
                    setSelectedMember(null);
                    removeMutation.reset();
                  }
                }}
                memberName={`${selectedMember.firstName} ${selectedMember.lastName}`}
                onRemove={handleRemove}
                isPending={removeMutation.isPending}
                errorMessage={
                  removeMutation.isError
                    ? getErrorMessage(removeMutation.error)
                    : null
                }
              />
            </>
          )}
        </>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Helpers                                                                    */
/* -------------------------------------------------------------------------- */

function getErrorMessage(error: unknown): string {
  if (typeof error === "string") {
    return error;
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  const axiosError = error as {
    response?: {
      data?: {
        message?: string;
        error?: string;
      };
    };
    message?: string;
  };

  return (
    axiosError?.response?.data?.message ||
    axiosError?.response?.data?.error ||
    axiosError?.message ||
    "Failed to remove member. Please try again."
  );
}

/* -------------------------------------------------------------------------- */
/* Components                                                                 */
/* -------------------------------------------------------------------------- */

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
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex min-w-0 items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
          {icon}
        </div>

        <div className="min-w-0">
          <h2 className="text-lg font-semibold">{title}</h2>

          <p className="mt-0.5 text-sm text-muted-foreground">{description}</p>
        </div>
      </div>

      {action}
    </div>
  );
}

function InfoPill({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="inline-flex items-center gap-1.5 rounded-full border border-border bg-muted/40 px-3 py-1.5 text-xs font-medium text-muted-foreground">
      {icon}
      {label}
    </div>
  );
}

function MemberCard({
  member,
  isCurrentUser,
  canManage,
  onChangeRole,
  onRemove,
}: {
  member: TeamMemberResponse;
  isCurrentUser: boolean;
  canManage: boolean;
  onChangeRole: () => void;
  onRemove: () => void;
}) {
  const initials = `${member.firstName?.[0] ?? ""}${
    member.lastName?.[0] ?? ""
  }`.toUpperCase();

  return (
    <div className="group rounded-2xl border border-border bg-card p-4 transition hover:border-primary/30 hover:shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-sm font-semibold text-primary">
            {initials || "?"}
          </div>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <p className="truncate font-medium">
                {member.firstName} {member.lastName}
              </p>

              {isCurrentUser && (
                <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-medium text-primary">
                  You
                </span>
              )}
            </div>

            <p className="mt-0.5 truncate text-xs text-muted-foreground">
              {member.email}
            </p>
          </div>
        </div>

        {canManage && (
          <div className="flex shrink-0 items-center gap-1">
            <button
              type="button"
              title="Change role"
              aria-label={`Change role for ${member.firstName} ${member.lastName}`}
              onClick={onChangeRole}
              className="rounded-lg p-2 text-muted-foreground transition hover:bg-muted hover:text-foreground"
            >
              <MoreHorizontal className="h-4 w-4" />
            </button>

            <button
              type="button"
              title="Remove member"
              aria-label={`Remove ${member.firstName} ${member.lastName}`}
              onClick={onRemove}
              className="rounded-lg p-2 text-muted-foreground transition hover:bg-destructive/10 hover:text-destructive"
            >
              <UserMinus className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <span className="rounded-full bg-muted px-2.5 py-1 text-xs font-medium">
          {formatLabel(member.role)}
        </span>

        <span
          className={`rounded-full px-2.5 py-1 text-xs font-medium ${
            member.status === "ACCEPTED"
              ? "bg-primary/10 text-primary"
              : "bg-muted text-muted-foreground"
          }`}
        >
          {formatLabel(member.status)}
        </span>
      </div>
    </div>
  );
}

function EmptyState({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-3xl border border-dashed border-border bg-card/50 px-6 py-10 text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
        {icon}
      </div>

      <h3 className="mt-4 font-medium">{title}</h3>

      <p className="mx-auto mt-1 max-w-sm text-sm text-muted-foreground">
        {description}
      </p>
    </div>
  );
}

function MembersSkeleton() {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <div
          key={index}
          className="rounded-2xl border border-border bg-card p-4"
        >
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 animate-pulse rounded-xl bg-muted" />

            <div className="flex-1 space-y-2">
              <div className="h-4 w-28 animate-pulse rounded bg-muted" />
              <div className="h-3 w-36 animate-pulse rounded bg-muted" />
            </div>
          </div>

          <div className="mt-4 flex gap-2">
            <div className="h-6 w-20 animate-pulse rounded-full bg-muted" />
            <div className="h-6 w-20 animate-pulse rounded-full bg-muted" />
          </div>
        </div>
      ))}
    </div>
  );
}

function TasksSkeleton() {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {Array.from({ length: 4 }).map((_, index) => (
        <div
          key={index}
          className="h-44 animate-pulse rounded-2xl border border-border bg-muted/40"
        />
      ))}
    </div>
  );
}

function TeamDetailsSkeleton() {
  return (
    <div className="space-y-8">
      <div className="h-5 w-32 animate-pulse rounded bg-muted" />

      <section className="rounded-3xl border border-border bg-card p-6 sm:p-8">
        <div className="flex items-start gap-4">
          <div className="h-14 w-14 animate-pulse rounded-2xl bg-muted" />

          <div className="flex-1 space-y-3">
            <div className="h-8 w-64 animate-pulse rounded bg-muted" />
            <div className="h-4 max-w-xl animate-pulse rounded bg-muted" />
            <div className="h-4 w-96 max-w-full animate-pulse rounded bg-muted" />
          </div>
        </div>
      </section>

      <div className="space-y-4">
        <div className="h-10 w-56 animate-pulse rounded-xl bg-muted" />
        <MembersSkeleton />
      </div>

      <div className="space-y-4">
        <div className="h-10 w-40 animate-pulse rounded-xl bg-muted" />
        <TasksSkeleton />
      </div>
    </div>
  );
}

function formatLabel(value?: string) {
  if (!value) return "";

  return value
    .toLowerCase()
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}
