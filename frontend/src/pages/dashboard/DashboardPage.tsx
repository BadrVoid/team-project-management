import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  AlertCircle,
  CheckCircle2,
  FolderKanban,
  ListTodo,
  MessageSquare,
  MoreHorizontal,
  RefreshCw,
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

import Dashboard3D from "@/components/dashboard/Dashboard3d";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useDashboard } from "@/hooks/useDashboard";

/* Chart Custom Tooltip */
function ChartTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ value?: number }>;
  label?: string;
}) {
  if (!active || !payload?.length) return null;

  return (
    <div className="rounded-lg border border-border bg-card p-2.5 shadow-md">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 text-sm font-semibold text-foreground">
        {payload[0]?.value ?? 0} tasks completed
      </p>
    </div>
  );
}

/* Dashboard Skeleton Loader */
function DashboardSkeleton() {
  return (
    <div className="mx-auto w-full max-w-[1400px] space-y-8 animate-pulse">
      <div className="space-y-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-9 w-64" />
        <Skeleton className="h-4 w-80" />
      </div>

      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        {Array.from({ length: 2 }).map((_, i) => (
          <Skeleton key={i} className="h-28 rounded-xl" />
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-5">
        <Skeleton className="h-[380px] rounded-xl xl:col-span-3" />
        <Skeleton className="h-[380px] rounded-xl xl:col-span-2" />
      </div>
    </div>
  );
}

/* Main Dashboard Component */
export default function DashboardPage() {
  const navigate = useNavigate();

  const {
    projects = [],
    tasks = [],
    notifications = [],
    isLoading,
    isError,
    projectTasks: projectTasksData = [],
  } = useDashboard();

  /*
     Aggregated Task Metrics & Chart Data (Single Pass)
  */
  const taskMetrics = useMemo(() => {
    let activeCount = 0;
    let todoCount = 0;
    let inProgressCount = 0;

    const daysMap: Record<string, number> = {
      Mon: 0,
      Tue: 0,
      Wed: 0,
      Thu: 0,
      Fri: 0,
      Sat: 0,
      Sun: 0,
    };

    tasks.forEach((task) => {
      if (task.status !== "COMPLETED") activeCount++;
      if (task.status === "TODO") todoCount++;
      if (task.status === "IN_PROGRESS") inProgressCount++;

      if (task.status === "COMPLETED") {
        const dateString = task.completedAt || task.updatedAt;
        if (dateString) {
          const dayName = new Date(dateString).toLocaleDateString("en-US", {
            weekday: "short",
          });
          if (daysMap[dayName] !== undefined) {
            daysMap[dayName]++;
          }
        }
      }
    });

    const completionData = [
      { day: "Mon", completed: daysMap.Mon },
      { day: "Tue", completed: daysMap.Tue },
      { day: "Wed", completed: daysMap.Wed },
      { day: "Thu", completed: daysMap.Thu },
      { day: "Fri", completed: daysMap.Fri },
      { day: "Sat", completed: daysMap.Sat },
      { day: "Sun", completed: daysMap.Sun },
    ];

    const taskDistribution = [
      { name: "Todo", value: todoCount, color: "hsl(var(--muted-foreground))" },
      {
        name: "In Progress",
        value: inProgressCount,
        color: "hsl(var(--chart-1, 217 91% 60%))",
      },
    ];

    return { activeCount, completionData, taskDistribution };
  }, [tasks]);

  // KPI Cards Configuration
  const stats = useMemo(
    () => [
      {
        label: "Projects",
        value: projects.length.toString(),
        change: "Active in workspace",
        icon: FolderKanban,
      },
      {
        label: "Active Tasks",
        value: taskMetrics.activeCount.toString(),
        change: "Pending completion",
        icon: ListTodo,
      },
    ],
    [projects.length, taskMetrics.activeCount],
  );

  // Project Progress Calculation
  const dashboardProjects = useMemo(() => {
    return projects.slice(0, 5).map((project) => {
      const projectTasks =
        projectTasksData.find((item) => item.projectId === project.id)?.tasks ??
        [];

      const completedProjectTasks = projectTasks.filter(
        (t) => t.status === "COMPLETED",
      ).length;

      const progress =
        projectTasks.length > 0
          ? Math.round((completedProjectTasks / projectTasks.length) * 100)
          : 0;

      return {
        ...project,
        memberCount: project.members?.length ?? project.memberCount ?? 0,
        taskCount: projectTasks.length,
        progress,
      };
    });
  }, [projects, projectTasksData]);

  // Recent Activity Mapping
  const activities = useMemo(() => {
    return notifications.slice(0, 4).map((notification) => ({
      id: notification.id,
      icon:
        notification.type === "TASK_ASSIGNED"
          ? Users
          : notification.type === "TASK_COMMENTED"
            ? MessageSquare
            : CheckCircle2,
      text: notification.message,
      time: new Date(notification.createdAt).toLocaleString("en-US", {
        dateStyle: "medium",
        timeStyle: "short",
      }),
    }));
  }, [notifications]);

  /* Conditional Rendering States */

  if (isLoading) return <DashboardSkeleton />;

  if (isError) {
    return (
      <div className="mx-auto flex w-full max-w-[1400px] flex-col items-center justify-center py-16 text-center">
        <div className="rounded-full bg-destructive/10 p-4 text-destructive">
          <AlertCircle className="size-8" />
        </div>
        <h1 className="mt-4 text-2xl font-bold tracking-tight">
          Failed to load dashboard
        </h1>
        <p className="mt-2 max-w-sm text-sm text-muted-foreground">
          There was an error communicating with your workspace server.
        </p>
        <Button className="mt-6 gap-2" onClick={() => window.location.reload()}>
          <RefreshCw className="size-4" /> Try again
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-[1400px] space-y-8">
      {/* Header Section */}
      <section className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="mb-1 text-xs font-semibold tracking-[0.2em] text-primary uppercase">
            Workspace
          </p>
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
            Welcome back
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Here's what's happening across your projects today.
          </p>
        </div>

        <div className="hidden sm:block">
          <Dashboard3D />
        </div>
      </section>

      {/* KPI Stats Grid */}
      <section className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card
              key={stat.label}
              className="border-border/60 bg-card p-5 shadow-none transition-all duration-200 hover:-translate-y-0.5"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-medium text-muted-foreground">
                    {stat.label}
                  </p>
                  <p className="mt-2 text-3xl font-bold tracking-tight">
                    {stat.value}
                  </p>
                </div>
                <div className="rounded-xl bg-primary/10 p-3 text-primary">
                  <Icon className="size-5" />
                </div>
              </div>
              <p className="mt-3 text-xs text-muted-foreground">
                {stat.change}
              </p>
            </Card>
          );
        })}
      </section>

      {/* Charts Section */}
      <section className="grid gap-6 xl:grid-cols-5">
        {/* Weekly Completion Chart */}
        <Card className="border-border/60 bg-card shadow-none xl:col-span-3">
          <div className="border-b border-border/60 px-5 py-4 md:px-6">
            <p className="text-sm font-semibold">Task completion</p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Tasks completed over the course of this week
            </p>
          </div>

          <div className="h-[300px] px-2 pb-4 pt-6 md:px-6">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={taskMetrics.completionData}
                margin={{ top: 5, right: 10, left: -20, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="taskGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="0%"
                      stopColor="hsl(var(--primary))"
                      stopOpacity={0.3}
                    />
                    <stop
                      offset="100%"
                      stopColor="hsl(var(--primary))"
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
                  tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  allowDecimals={false}
                  tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
                />
                <Tooltip content={<ChartTooltip />} />
                <Area
                  type="monotone"
                  dataKey="completed"
                  stroke="hsl(var(--primary))"
                  strokeWidth={3}
                  fill="url(#taskGradient)"
                  dot={{
                    r: 4,
                    fill: "hsl(var(--primary))",
                    strokeWidth: 2,
                    stroke: "hsl(var(--background))",
                  }}
                  activeDot={{ r: 6 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Task Distribution Donut Chart */}
        <Card className="border-border/60 bg-card shadow-none xl:col-span-2">
          <div className="border-b border-border/60 px-5 py-4 md:px-6">
            <p className="text-sm font-semibold">Task distribution</p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Breakdown of tasks by status
            </p>
          </div>

          <div className="flex flex-col items-center justify-center px-5 py-6 md:px-6">
            <div className="relative h-[210px] w-[210px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={taskMetrics.taskDistribution}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={62}
                    outerRadius={90}
                    paddingAngle={3}
                    strokeWidth={0}
                  >
                    {taskMetrics.taskDistribution.map((item) => (
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

            <div className="mt-5 grid w-full grid-cols-2 gap-x-6 gap-y-3">
              {taskMetrics.taskDistribution.map((item) => (
                <div
                  key={item.name}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="size-2.5 rounded-full"
                      style={{ backgroundColor: item.color }}
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

      {/* Projects & Deadlines Section */}
      <section className="grid items-start gap-6 xl:grid-cols-5">
        {/* Projects Card */}
        <Card className="border-border/60 bg-card shadow-none xl:col-span-3">
          <div className="flex items-center justify-between border-b border-border/60 px-5 py-4 md:px-6">
            <div>
              <p className="text-sm font-semibold">Active projects</p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Your primary active workspaces
              </p>
            </div>
          </div>

          <div className="divide-y divide-border/30">
            {dashboardProjects.map((project) => (
              <div
                key={project.id}
                className="px-5 py-5 transition-colors hover:bg-muted/30 md:px-6"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex min-w-0 gap-3">
                    <div className="mt-0.5 rounded-xl bg-primary/10 p-2.5 text-primary shrink-0">
                      <FolderKanban className="size-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold truncate">
                        {project.name}
                      </p>
                      <p className="mt-0.5 text-xs text-muted-foreground line-clamp-1">
                        {project.description || "No description provided."}
                      </p>
                    </div>
                  </div>

                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-8 shrink-0"
                    onClick={() => navigate(`/projects/${project.id}`)}
                  >
                    <MoreHorizontal className="size-4" />
                  </Button>
                </div>

                <div className="mt-4">
                  <div className="mb-2 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3 text-muted-foreground">
                      <span>{project.memberCount} members</span>
                      <span>{project.taskCount} tasks</span>
                    </div>
                    <span className="font-semibold">{project.progress}%</span>
                  </div>

                  <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full rounded-full bg-primary transition-all duration-300"
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </section>

      {/* Recent Activity List */}
      <Card className="border-border/60 bg-card shadow-none">
        <div className="flex items-center justify-between border-b border-border/60 px-5 py-4 md:px-6">
          <div>
            <p className="text-sm font-semibold">Recent activity</p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Real-time audit log of workspace events
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2">
          {activities.length === 0 ? (
            <p className="col-span-2 py-8 text-center text-xs text-muted-foreground">
              No recent activity.
            </p>
          ) : (
            activities.map((activity) => {
              const Icon = activity.icon;
              return (
                <div
                  key={activity.id}
                  className="flex gap-3 border-b border-border/30 px-5 py-4 transition-colors hover:bg-muted/30 md:px-6"
                >
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-muted">
                    <Icon className="size-4 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-sm">{activity.text}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {activity.time}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </Card>
    </div>
  );
}
