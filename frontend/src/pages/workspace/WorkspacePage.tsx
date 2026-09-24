import { CheckSquare, FolderKanban, Users } from "lucide-react";
import { useSearchParams } from "react-router-dom";

import ProjectsView from "./ProjectsView";
import TasksView from "./TasksView";
import TeamsView from "./TeamsView";

type WorkspaceView = "projects" | "teams" | "tasks";

export default function WorkspacePage() {
  const [searchParams, setSearchParams] = useSearchParams();

  // Read current tab from query string, defaulting to "projects"
  const rawTab = searchParams.get("tab");
  const activeView: WorkspaceView =
    rawTab === "teams" || rawTab === "tasks" ? rawTab : "projects";

  const handleTabChange = (view: WorkspaceView) => {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        if (view === "projects") {
          next.delete("tab");
        } else {
          next.set("tab", view);
        }
        return next;
      },
      { replace: true },
    );
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <section>
        <div className="flex items-start gap-4">
          <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-primary/10">
            <FolderKanban className="size-7 text-primary" />
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
      <div className="rounded-2xl border border-border bg-background p-2 shadow-sm flex justify-center">
        <nav className="flex gap-1 overflow-x-auto">
          <WorkspaceTab
            active={activeView === "projects"}
            onClick={() => handleTabChange("projects")}
            icon={<FolderKanban className="size-4" />}
          >
            Projects
          </WorkspaceTab>

          <WorkspaceTab
            active={activeView === "teams"}
            onClick={() => handleTabChange("teams")}
            icon={<Users className="size-4" />}
          >
            Teams
          </WorkspaceTab>

          <WorkspaceTab
            active={activeView === "tasks"}
            onClick={() => handleTabChange("tasks")}
            icon={<CheckSquare className="size-4" />}
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
