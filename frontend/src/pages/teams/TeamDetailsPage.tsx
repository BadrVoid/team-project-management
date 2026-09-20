import { useState } from "react";
import {
  ArrowLeft,
  Edit,
  MoreHorizontal,
  Plus,
  Trash2,
  UserMinus,
  Users,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

import { useTeam } from "@/hooks/useTeams";
import {
  useAddTeamMember,
  useRemoveTeamMember,
  useTeamMembers,
} from "@/hooks/useTeamMembers";
import { useDeleteTask, useTasksByTeam } from "@/hooks/useTasks";

import { EditTeamDialog } from "@/components/teams/EditTeamDialog";
import { DeleteTeamDialog } from "@/components/teams/DeleteTeamDialog";
import { InviteMemberDialog } from "@/components/members/InviteMemberDialog";
import { RemoveTeamMemberDialog } from "@/components/teams/RemoveTeamMemberDialog";
import { UpdateTeamMemberRoleDialog } from "@/components/teams/UpdateTeamMemberRoleDialog";
import CreateTaskDialog  from "@/components/tasks/CreateTasksDialog";
import TaskCard from "@/components/tasks/TaskCard";

import type { TeamMemberResponse } from "@/api/types";

export default function TeamDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isInviteOpen, setIsInviteOpen] = useState(false);

  const [selectedMember, setSelectedMember] =
    useState<TeamMemberResponse | null>(null);

  const [isRoleOpen, setIsRoleOpen] = useState(false);
  const [isRemoveOpen, setIsRemoveOpen] = useState(false);

  const teamId = id ?? "";

  const {
    data: team,
    isLoading: isTeamLoading,
    isError: isTeamError,
  } = useTeam(teamId);

  const { data: members = [], isLoading: isMembersLoading } =
    useTeamMembers(teamId);

  const { data: tasks = [], isLoading: isTasksLoading } =
    useTasksByTeam(teamId);

  const addMemberMutation = useAddTeamMember(teamId);

  const removeMemberMutation = useRemoveTeamMember(teamId);

  const deleteTaskMutation = useDeleteTask();

  if (isTeamLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  if (isTeamError || !team) {
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

  const handleInvite = (userId: string, role: string) => {
    addMemberMutation.mutate({
      userId,
      role: role as "LEADER" | "MEMBER",
    });
  };

  const handleRemove = () => {
    if (!selectedMember) return;

    removeMemberMutation.mutate(selectedMember.userId, {
      onSuccess: () => {
        setIsRemoveOpen(false);
        setSelectedMember(null);
      },
    });
  };

  const openRoleDialog = (member: TeamMemberResponse) => {
    setSelectedMember(member);
    setIsRoleOpen(true);
  };

  const openRemoveDialog = (member: TeamMemberResponse) => {
    setSelectedMember(member);
    setIsRemoveOpen(true);
  };

  const handleDeleteTask = (taskId: string) => {
    deleteTaskMutation.mutate(taskId);
  };

  return (
    <div className="space-y-8 pb-10">
      {/* Navigation + Actions */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="button"
          onClick={() => navigate(`/projects/${team.projectId}`)}
          className="group flex w-fit items-center gap-2 text-sm text-muted-foreground transition hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Back to Project
        </button>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsEditOpen(true)}
            className="flex items-center gap-2 rounded-xl border border-border px-3 py-2 text-sm font-medium transition hover:bg-muted"
          >
            <Edit className="h-4 w-4" />

            <span className="hidden sm:inline">Edit Team</span>
          </button>

          <button
            type="button"
            onClick={() => setIsDeleteOpen(true)}
            className="flex items-center gap-2 rounded-xl border border-destructive/30 px-3 py-2 text-sm font-medium text-destructive transition hover:bg-destructive/10"
          >
            <Trash2 className="h-4 w-4" />

            <span className="hidden sm:inline">Delete</span>
          </button>
        </div>
      </div>

      {/* Team Header */}
      <section className="rounded-3xl border border-border/80 bg-card p-6 shadow-sm sm:p-8">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-primary/10">
            <Users className="h-8 w-8 text-primary" />
          </div>

          <div className="min-w-0">
            <h1 className="text-2xl font-bold tracking-tight">{team.name}</h1>

            <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
              {team.description || "No description provided."}
            </p>
          </div>
        </div>
      </section>

      {/* Members */}
      <section className="rounded-2xl border border-border bg-background p-6">
        <div className="mb-5 flex items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold">Team Members</h2>

            <p className="mt-1 text-sm text-muted-foreground">
              People working in this team.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsInviteOpen(true)}
            className="flex items-center gap-2 rounded-xl bg-primary px-3 py-2 text-sm font-medium text-primary-foreground transition hover:opacity-90"
          >
            <Plus className="h-4 w-4" />

            <span className="hidden sm:inline">Invite Member</span>
          </button>
        </div>

        {isMembersLoading ? (
          <div className="flex min-h-[180px] items-center justify-center">
            <div className="h-7 w-7 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          </div>
        ) : members.length === 0 ? (
          <div className="flex min-h-[180px] items-center justify-center rounded-xl border border-dashed border-border">
            <div className="text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                <Users className="h-5 w-5 text-primary" />
              </div>

              <p className="mt-3 text-sm font-medium">No members yet</p>

              <p className="mt-1 text-xs text-muted-foreground">
                Invite people to this team.
              </p>
            </div>
          </div>
        ) : (
          <div className="divide-y divide-border rounded-xl border border-border">
            {members.map((member) => (
              <div
                key={member.id}
                className="flex items-center justify-between gap-4 p-4"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                    {(member.firstName?.[0] ?? "") +
                      (member.lastName?.[0] ?? "")}
                  </div>

                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">
                      {member.firstName} {member.lastName}
                    </p>

                    <p className="truncate text-sm text-muted-foreground">
                      {member.email}
                    </p>

                    <span
                      className={`mt-1 inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                        member.role === "LEADER"
                          ? "bg-primary/10 text-primary"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {member.role}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => openRoleDialog(member)}
                    className="rounded-lg p-2 text-muted-foreground transition hover:bg-muted hover:text-foreground"
                    title="Change role"
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => openRemoveDialog(member)}
                    className="rounded-lg p-2 text-muted-foreground transition hover:bg-destructive/10 hover:text-destructive"
                    title="Remove member"
                  >
                    <UserMinus className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Tasks */}
      <section className="rounded-2xl border border-border bg-background p-6">
        <div className="mb-5 flex items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold">Tasks</h2>

            <p className="mt-1 text-sm text-muted-foreground">
              Manage tasks assigned to this team.
            </p>
          </div>

          <CreateTaskDialog teamId={team.id} members={members} />
        </div>

        {isTasksLoading ? (
          <div className="flex min-h-[180px] items-center justify-center">
            <div className="h-7 w-7 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          </div>
        ) : tasks.length === 0 ? (
          <div className="flex min-h-[180px] items-center justify-center rounded-xl border border-dashed border-border">
            <div className="text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                <Plus className="h-5 w-5 text-primary" />
              </div>

              <p className="mt-3 text-sm font-medium">No tasks yet</p>

              <p className="mt-1 text-xs text-muted-foreground">
                Create the first task for this team.
              </p>
            </div>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onEdit={() => navigate(`/tasks/${task.id}`)}
                onDelete={() => handleDeleteTask(task.id)}
              />
            ))}
          </div>
        )}
      </section>

      {/* Dialogs */}
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

      <InviteMemberDialog
        open={isInviteOpen}
        onOpenChange={setIsInviteOpen}
        title="Invite Team Member"
        description="Search for a user and add them to this team."
        roleOptions={["MEMBER", "LEADER"]}
        defaultRole="MEMBER"
        onInvite={handleInvite}
        isPending={addMemberMutation.isPending}
        isError={addMemberMutation.isError}
      />

      {selectedMember && (
        <>
          <UpdateTeamMemberRoleDialog
            open={isRoleOpen}
            onOpenChange={setIsRoleOpen}
            teamId={team.id}
            member={selectedMember}
          />

          <RemoveTeamMemberDialog
            open={isRemoveOpen}
            onOpenChange={setIsRemoveOpen}
            memberName={`${selectedMember.firstName} ${selectedMember.lastName}`}
            onRemove={handleRemove}
            isPending={removeMemberMutation.isPending}
            isError={removeMemberMutation.isError}
          />
        </>
      )}
    </div>
  );
}
