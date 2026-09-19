import {
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  Clock3,
  FolderKanban,
  ListTodo,
  MessageSquare,
  MoreHorizontal,
  Users,
} from "lucide-react";

import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Dashboard3D from "@/components/dashboard/Dashboard3d";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useDashboard } from "@/hooks/useDashboard";

/* Chart Tooltip */
function ChartTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{
    value?: number;
  }>;
  label?: string;
}) {
  if (!active || !payload?.length) {
    return null;
  }

  return (
    <div className="rounded-lg border bg-card px-3 py-2 shadow-lg">
      <p className="text-xs text-muted-foreground">{label}</p>

      <p className="mt-1 text-sm font-semibold">
        {payload[0]?.value} tasks completed
      </p>
    </div>
  );
}

export default function DashboardPage() {
  const navigate = useNavigate();

  const [showAllDeadlines, setShowAllDeadlines] = useState(false);
  const [showAllProjects, setShowAllProjects] = useState(false);

  const {
    projects,
    tasks,
    notifications,
    isLoading,
    isError,
    projectTasks: projectTasksData,
  } = useDashboard();

  /* =========================
     Statistics
  ========================= */

  const activeTasks = tasks.filter(
    (task) => task.status !== "COMPLETED",
  ).length;

  const completedTasks = tasks.filter(
    (task) => task.status === "COMPLETED",
  ).length;

  const stats = [
    {
      label: "Projects",
      value: projects.length.toString(),
      change: "In your workspace",
      icon: FolderKanban,
    },
    {
      label: "Active Tasks",
      value: activeTasks.toString(),
      change: "Assigned to you",
      icon: ListTodo,
    },
    {
      label: "Completed",
      value: completedTasks.toString(),
      change: "Completed tasks",
      icon: CheckCircle2,
    },
    {
      label: "Members",
      value: "—",
      change: "Coming from projects",
      icon: Users,
    },
  ];

  /* =========================
     Task Distribution
  ========================= */

  const taskDistribution = [
    {
      name: "Todo",
      value: tasks.filter((task) => task.status === "TODO").length,
      color: "var(--muted-foreground)",
    },
    {
      name: "In Progress",
      value: tasks.filter((task) => task.status === "IN_PROGRESS").length,
      color: "color-mix(in srgb, var(--primary) 45%, transparent)",
    },
    {
      name: "In Review",
      value: tasks.filter((task) => task.status === "IN_REVIEW").length,
      color: "color-mix(in srgb, var(--primary) 70%, transparent)",
    },
    {
      name: "Completed",
      value: completedTasks,
      color: "var(--primary)",
    },
  ];

  /* =========================
     Completion Chart

     TaskResponse does not currently
     contain completedAt, so we cannot
     calculate real completion per day.
  ========================= */

  const completionData = [
    { day: "Mon", completed: 0 },
    { day: "Tue", completed: 0 },
    { day: "Wed", completed: 0 },
    { day: "Thu", completed: 0 },
    { day: "Fri", completed: 0 },
    { day: "Sat", completed: 0 },
    { day: "Sun", completed: 0 },
  ];

  /* =========================
     Projects

     Project
        ↓
     Teams
        ↓
     Tasks
  ========================= */

  const dashboardProjects = projects.map((project) => {
    const projectTasks =
      projectTasksData.find((item) => item.projectId === project.id)?.tasks ??
      [];

    const completedProjectTasks = projectTasks.filter(
      (task) => task.status === "COMPLETED",
    ).length;

    const progress =
      projectTasks.length > 0
        ? Math.round((completedProjectTasks / projectTasks.length) * 100)
        : 0;

    return {
      ...project,
      members: 0,
      tasks: projectTasks.length,
      progress,
    };
  });

  /* =========================
     Upcoming Deadlines
  ========================= */

  const deadlines = tasks
    .filter((task) => task.dueDate)
    .sort((a, b) => {
      return new Date(a.dueDate!).getTime() - new Date(b.dueDate!).getTime();
    })
    .map((task) => ({
      id: task.id,
      title: task.title,
      project: task.teamId,
      date: new Date(task.dueDate!).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      urgent: task.priority === "URGENT" || task.priority === "HIGH",
    }));

  /* =========================
     Recent Activity
  ========================= */

  const activities = notifications.map((notification) => ({
    id: notification.id,
    icon:
      notification.type === "TASK_ASSIGNED"
        ? Users
        : notification.type === "TASK_COMMENTED"
          ? MessageSquare
          : notification.type === "TASK_UPDATED"
            ? CheckCircle2
            : Users,
    text: notification.message,
    target: "",
    time: new Date(notification.createdAt).toLocaleString("en-US", {
      dateStyle: "medium",
      timeStyle: "short",
    }),
  }));

  /* =========================
     Loading
  ========================= */

  if (isLoading) {
    return (
      <div className="mx-auto w-full max-w-[1400px] space-y-8">
        <div>
          <p className="mb-2 text-xs font-semibold tracking-[0.2em] text-primary">
            WORKSPACE
          </p>

          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
            Loading dashboard...
          </h1>

          <p className="mt-2 max-w-xl text-sm text-muted-foreground">
            Loading your workspace data.
          </p>
        </div>
      </div>
    );
  }

  /* =========================
     Error
  ========================= */

  if (isError) {
    return (
      <div className="mx-auto w-full max-w-[1400px] space-y-8">
        <div>
          <p className="mb-2 text-xs font-semibold tracking-[0.2em] text-primary">
            WORKSPACE
          </p>

          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
            Something went wrong
          </h1>

          <p className="mt-2 max-w-xl text-sm text-muted-foreground">
            We couldn't load your dashboard data. Please try again.
          </p>

          <Button className="mt-5" onClick={() => window.location.reload()}>
            Try again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-[1400px] space-y-8">
      {/* =========================
          Header
      ========================= */}

      <section className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        {/* Left */}

        <div>
          <p className="mb-2 text-xs font-semibold tracking-[0.2em] text-primary">
            WORKSPACE
          </p>

          <h1 className="text-3xl uppercase font-bold tracking-tight md:text-4xl">
            Welcome
          </h1>

          <p className="mt-2 max-w-xl text-sm text-muted-foreground">
            Here's what's happening across your projects today.
          </p>
        </div>

        {/* Right */}
        <div className="hidden sm:block">
          <Dashboard3D />
        </div>
      </section>

      {/* =========================
          Statistics
      ========================= */}

      <section className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <Card
              key={stat.label}
              className="border-border/60 bg-card p-5 shadow-none transition-all duration-200 hover:-translate-y-0.5 animate-card-enter"
            >
              <div className="flex items-start justify-between">
                {/* Left */}

                <div>
                  <p className="text-xs font-medium text-muted-foreground">
                    {stat.label}
                  </p>

                  <p className="mt-2 text-3xl font-bold tracking-tight">
                    {stat.value}
                  </p>
                </div>

                {/* Right */}

                <div className="rounded-xl bg-primary/10 p-3 text-primary">
                  <Icon className="size-5" />
                </div>
              </div>

              {/* Bottom */}

              <p className="mt-3 text-xs text-muted-foreground">
                {stat.change}
              </p>
            </Card>
          );
        })}
      </section>

      {/* =========================
          Charts
      ========================= */}

      <section className="grid gap-6 xl:grid-cols-5">
        {/* Completion Chart */}

        <Card className="border-border/60 bg-card shadow-none xl:col-span-3">
          {/* Title */}

          <div className="border-b border-border px-5 py-4 md:px-6">
            <p className="text-sm font-semibold">Task completion</p>

            <p className="mt-1 text-xs text-muted-foreground">
              Tasks completed during the week
            </p>
          </div>

          {/* Chart */}

          <div className="h-[300px] px-2 pb-4 pt-6 md:px-6">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={completionData}
                margin={{
                  top: 5,
                  right: 10,
                  left: -20,
                  bottom: 0,
                }}
              >
                <defs>
                  <linearGradient id="taskGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="0%"
                      stopColor="var(--primary)"
                      stopOpacity={0.3}
                    />

                    <stop
                      offset="100%"
                      stopColor="var(--primary)"
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>

                <CartesianGrid
                  strokeDasharray="3 3"
                  className="stroke-border/50"
                  vertical={false}
                />

                <XAxis
                  dataKey="day"
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fill: "var(--muted-foreground)",
                    fontSize: 11,
                  }}
                />

                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fill: "var(--muted-foreground)",
                    fontSize: 11,
                  }}
                />

                <Tooltip
                  content={<ChartTooltip />}
                  cursor={{
                    stroke: "var(--primary)",
                    strokeOpacity: 0.2,
                  }}
                />

                <Area
                  type="monotone"
                  dataKey="completed"
                  stroke="var(--primary)"
                  strokeWidth={3}
                  fill="url(#taskGradient)"
                  dot={{
                    r: 4,
                    fill: "var(--primary)",
                    strokeWidth: 2,
                    stroke: "var(--background)",
                  }}
                  activeDot={{
                    r: 6,
                  }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Distribution Chart */}

        <Card className="border-border/60 bg-card shadow-none xl:col-span-2">
          {/* Title */}

          <div className="border-b border-border/60 px-5 py-4 md:px-6">
            <p className="text-sm font-semibold">Task distribution</p>

            <p className="mt-1 text-xs text-muted-foreground">
              Current status of your tasks
            </p>
          </div>

          {/* Main Chart */}

          <div className="flex flex-col items-center justify-center px-5 py-6 md:px-6">
            <div className="relative h-[210px] w-[210px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={taskDistribution}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={62}
                    outerRadius={90}
                    paddingAngle={3}
                    strokeWidth={0}
                  >
                    {taskDistribution.map((item) => (
                      <Cell key={item.name} fill={item.color} />
                    ))}
                  </Pie>

                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>

              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-bold">{tasks.length}</span>

                <span className="text-xs text-muted-foreground">
                  Total tasks
                </span>
              </div>
            </div>

            <div className="mt-5 grid w-full grid-cols-2 gap-x-6 gap-y-4">
              {taskDistribution.map((item) => (
                <div
                  key={item.name}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="size-2.5 rounded-full"
                      style={{
                        backgroundColor: item.color,
                      }}
                    />

                    <span className="text-xs text-muted-foreground">
                      {item.name}
                    </span>
                  </div>

                  <span className="text-sm font-semibold">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </section>

      {/* =========================
          Projects + Deadlines
      ========================= */}

      <section className="grid items-start gap-6 xl:grid-cols-5">
        {/* Projects */}

        <Card className="border-border/60 bg-card shadow-none xl:col-span-3">
          {/* Title */}

          <div className="flex items-center justify-between border-b border-border/60 px-5 py-4 md:px-6">
            <div>
              <p className="text-sm font-semibold">Active projects</p>

              <p className="mt-1 text-xs text-muted-foreground">
                Your most recently updated projects
              </p>
            </div>

            {/* Right */}

            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/projects")}
            >
              View all
              <ArrowRight className="ml-2 size-4" />
            </Button>
          </div>

          {/* Content */}

          <div className="divide-y divide-border/30">
            {(showAllProjects
              ? dashboardProjects
              : dashboardProjects.slice(0, 2)
            ).map((project) => (
              <div
                key={project.id}
                className="px-5 py-5 transition-colors hover:bg-muted/30 md:px-6"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex min-w-0 gap-3">
                    <div className="mt-0.5 rounded-xl bg-primary/10 p-2.5 text-primary">
                      <FolderKanban className="size-4" />
                    </div>

                    <div className="min-w-0">
                      <p className="text-sm font-semibold">{project.name}</p>

                      <p className="mt-1 text-xs text-muted-foreground">
                        {project.description}
                      </p>
                    </div>
                  </div>

                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-8 shrink-0 opacity-100"
                    onClick={() => navigate(`/projects/${project.id}`)}
                  >
                    <MoreHorizontal className="size-4" />
                  </Button>
                </div>

                <div className="mt-5">
                  <div className="mb-2 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3 text-muted-foreground">
                      <span>{project.members} members</span>

                      <span>{project.tasks} tasks</span>
                    </div>

                    <span className="font-semibold">{project.progress}%</span>
                  </div>

                  <div className="h-1 rounded-full bg-muted">
                    <div
                      className="h-1 rounded-full bg-primary transition-all"
                      style={{
                        width: `${project.progress}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}

            {dashboardProjects.length > 2 && (
              <Button
                variant="ghost"
                size="sm"
                className="w-full rounded-none border-0 text-muted-foreground hover:bg-muted/30 hover:text-foreground"
                onClick={() => setShowAllProjects((prev) => !prev)}
              >
                {showAllProjects ? "Show less" : "Show more"}

                <ChevronDown
                  className={`ml-2 size-4 transition-transform ${
                    showAllProjects ? "rotate-180" : ""
                  }`}
                />
              </Button>
            )}
          </div>
        </Card>

        {/* Deadlines */}

        <Card className="rounded-2xl border-border/60 bg-card p-5 xl:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold">Upcoming deadlines</p>

              <p className="mt-1 text-xs text-muted-foreground">
                Keep an eye on what's next
              </p>
            </div>

            {/* Right */}

            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/tasks")}
            >
              View all
              <ArrowRight className="ml-2 size-4" />
            </Button>
          </div>

          <div className="mt-5 space-y-4">
            {(showAllDeadlines ? deadlines : deadlines.slice(0, 3)).map(
              (deadline) => (
                <div
                  key={deadline.id}
                  className="flex items-start gap-3 rounded-xl border border-border/60 p-3"
                >
                  <div
                    className={`mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg ${
                      deadline.urgent
                        ? "bg-destructive/10 text-destructive"
                        : "bg-primary/10 text-primary"
                    }`}
                  >
                    <Clock3 className="size-4" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">
                      {deadline.title}
                    </p>

                    <p className="mt-1 text-xs text-muted-foreground">
                      Team: {deadline.project}
                    </p>
                  </div>

                  <span
                    className={`shrink-0 text-xs font-medium ${
                      deadline.urgent
                        ? "text-destructive"
                        : "text-muted-foreground"
                    }`}
                  >
                    {deadline.date}
                  </span>
                </div>
              ),
            )}

            {deadlines.length > 3 && (
              <Button
                variant="ghost"
                size="sm"
                className="w-full text-muted-foreground hover:text-foreground"
                onClick={() => setShowAllDeadlines((prev) => !prev)}
              >
                {showAllDeadlines ? "Show less" : "Show more"}

                <ChevronDown
                  className={`ml-2 size-4 transition-transform ${
                    showAllDeadlines ? "rotate-180" : ""
                  }`}
                />
              </Button>
            )}
          </div>
        </Card>
      </section>

      {/* =========================
          Quick Actions
      ========================= */}

      <section>
        <div className="mb-4">
          <p className="text-sm font-semibold">Quick actions</p>

          <p className="mt-1 text-xs text-muted-foreground">
            Quickly navigate around your workspace
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {/* View Projects */}

          <Button
            variant="outline"
            className="h-20 justify-start gap-3 rounded-xl border-border/60 bg-card px-4 shadow-none hover:border-primary/40 hover:bg-primary/5"
            onClick={() => navigate("/projects")}
          >
            <div className="rounded-lg bg-primary/10 p-2 text-primary">
              <FolderKanban className="size-4" />
            </div>

            <div className="text-left">
              <p className="text-sm font-semibold">View projects</p>

              <p className="text-[11px] text-muted-foreground">
                Explore your projects
              </p>
            </div>
          </Button>

          {/* View Tasks */}

          <Button
            variant="outline"
            className="h-20 justify-start gap-3 rounded-xl border-border/60 bg-card px-4 shadow-none hover:border-primary/40 hover:bg-primary/5"
            onClick={() => navigate("/tasks")}
          >
            <div className="rounded-lg bg-primary/10 p-2 text-primary">
              <ListTodo className="size-4" />
            </div>

            <div className="text-left">
              <p className="text-sm font-semibold">View tasks</p>

              <p className="text-[11px] text-muted-foreground">
                Track your work
              </p>
            </div>
          </Button>

          {/* View Teams */}

          <Button
            variant="outline"
            className="h-20 justify-start gap-3 rounded-xl border-border/60 bg-card px-4 shadow-none hover:border-primary/40 hover:bg-primary/5"
            onClick={() => navigate("/teams")}
          >
            <div className="rounded-lg bg-primary/10 p-2 text-primary">
              <Users className="size-4" />
            </div>

            <div className="text-left">
              <p className="text-sm font-semibold">View teams</p>

              <p className="text-[11px] text-muted-foreground">
                Manage your teams
              </p>
            </div>
          </Button>

          {/* Notifications */}

          <Button
            variant="outline"
            className="h-20 justify-start gap-3 rounded-xl border-border/60 bg-card px-4 shadow-none hover:border-primary/40 hover:bg-primary/5"
            onClick={() => navigate("/notifications")}
          >
            <div className="rounded-lg bg-primary/10 p-2 text-primary">
              <MessageSquare className="size-4" />
            </div>

            <div className="text-left">
              <p className="text-sm font-semibold">Notifications</p>

              <p className="text-[11px] text-muted-foreground">
                View recent updates
              </p>
            </div>
          </Button>
        </div>
      </section>

      {/* =========================
          Recent Activity
      ========================= */}

      <Card className="border-border/60 bg-card shadow-none">
        {/* Title */}

        <div className="flex items-center justify-between border-b border-border/60 px-5 py-4 md:px-6">
          <div>
            <p className="text-sm font-semibold">Recent activity</p>

            <p className="mt-1 text-xs text-muted-foreground">
              Latest updates from your workspace
            </p>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/notifications")}
          >
            View all
            <ArrowRight className="ml-2 size-4" />
          </Button>
        </div>

        <div className="grid md:grid-cols-2">
          {activities.slice(0, 4).map((activity, index) => {
            const Icon = activity.icon;

            return (
              <div
                key={`${activity.id}-${index}`}
                className={`flex gap-3 border-l border-border/10 px-5 py-5 transition-colors hover:bg-muted/30 md:px-6 ${
                  index < activities.length - 2
                    ? "border-b border-border/60"
                    : ""
                }`}
              >
                <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-muted">
                  <Icon className="size-4 text-muted-foreground" />
                </div>

                <div>
                  <p className="text-sm">
                    {activity.text}

                    <span className="font-semibold">{activity.target}</span>
                  </p>

                  <p className="mt-1 text-xs text-muted-foreground">
                    {activity.time}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
