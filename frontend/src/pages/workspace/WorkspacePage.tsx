import { useState } from "react";
import { CheckSquare, FolderKanban, Users } from "lucide-react";

import ProjectsView from "./ProjectsView";
import TasksView from "./TasksView";
import TeamsView from "./TeamsView";
type WorkspaceView = "projects" | "teams" | "tasks";

export default function WorkspacePage() {
  const [activeView, setActiveView] = useState<WorkspaceView>("projects");

  return (
    <div className="space-y-8">
      {/* Header */}
      <section>
        <div className="flex items-start gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary/10">
            <FolderKanban className="h-7 w-7 text-primary" />
          </div>

          <div>
            <h1 className="text-2xl font-bold tracking-tight">Workspace</h1>

            <p className="mt-1 text-sm text-muted-foreground">
              Manage your projects, teams, and tasks in one place.
            </p>
          </div>
        </div>
      </section>

      {/* Quick Navigation */}
      <div className="rounded-2xl border border-border bg-background p-2 shadow-sm">
        <nav className="flex gap-1 overflow-x-auto">
          <WorkspaceTab
            active={activeView === "projects"}
            onClick={() => setActiveView("projects")}
            icon={<FolderKanban className="h-4 w-4" />}
          >
            Projects
          </WorkspaceTab>

          <WorkspaceTab
            active={activeView === "teams"}
            onClick={() => setActiveView("teams")}
            icon={<Users className="h-4 w-4" />}
          >
            Teams
          </WorkspaceTab>

          <WorkspaceTab
            active={activeView === "tasks"}
            onClick={() => setActiveView("tasks")}
            icon={<CheckSquare className="h-4 w-4" />}
          >
            Tasks
          </WorkspaceTab>
        </nav>
      </div>

      {/* Content */}
      <section>
        {activeView === "projects" && <ProjectsView />}

        {activeView === "teams" && <TeamsView />}

        {activeView === "tasks" && <TasksView />}
      </section>
    </div>
  );
}

function WorkspaceTab({
  active,
  onClick,
  icon,
  children,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex h-10 shrink-0 items-center gap-2 rounded-xl px-5 text-sm font-medium transition-all ${
        active
          ? "bg-primary text-primary-foreground shadow-sm"
          : "text-muted-foreground hover:bg-muted hover:text-foreground"
      }`}
    >
      {icon}
      {children}
    </button>
  );
}
