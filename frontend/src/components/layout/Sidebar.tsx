import { useState } from "react";
import {
  Bell,
  CheckSquare,
  ChevronLeft,
  ChevronRight,
  FolderKanban,
  LayoutDashboard,
  Settings,
  Users,
} from "lucide-react";
import { NavLink } from "react-router-dom";

import { Button } from "@/components/ui/button";

const navigation = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Spaces",
    href: "/spaces",
    icon: FolderKanban,
  },
  {
    title: "Projects",
    href: "/projects",
    icon: FolderKanban,
  },
  {
    title: "Teams",
    href: "/teams",
    icon: Users,
  },
  {
    title: "Tasks",
    href: "/tasks",
    icon: CheckSquare,
  },
  {
    title: "Notifications",
    href: "/notifications",
    icon: Bell,
  },
];

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <aside
      className={`relative hidden  border-r bg-card transition-[width] duration-300 ease-in-out md:flex md:flex-col ${
        isCollapsed ? "w-20" : "w-64"
      }`}
    >
      {/* Header */}
      <div
        className={`flex h-16  items-center border-b ${
          isCollapsed ? "justify-center px-3" : "px-5"
        }`}
      >
        <div className="flex min-w-0 items-center gap-3">
          {/* Logo */}
          <div className="size-9  overflow-hidden rounded-xl">
            <svg
              width="100%"
              height="100%"
              viewBox="0 0 56 56"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <rect width="56" height="56" rx="16" className="fill-primary" />

              <path
                d="M17 18H39"
                className="stroke-primary-foreground"
                strokeWidth="3.5"
                strokeLinecap="round"
              />

              <path
                d="M17 28H33"
                className="stroke-primary-foreground"
                strokeWidth="3.5"
                strokeLinecap="round"
              />

              <path
                d="M17 38H39"
                className="stroke-primary-foreground"
                strokeWidth="3.5"
                strokeLinecap="round"
              />

              <circle cx="37" cy="28" r="5" className="fill-accent" />

              <circle
                cx="37"
                cy="28"
                r="2"
                className="fill-accent-foreground"
              />
            </svg>
          </div>

          {/* Brand */}
          <div
            className={`overflow-hidden whitespace-nowrap transition-all duration-300 ${
              isCollapsed ? "w-0 opacity-0" : "w-[100px] opacity-100"
            }`}
          >
            <p className="text-base font-semibold tracking-tight">TeamFlow</p>

            <p className="text-[11px] text-muted-foreground">
              Project management
            </p>
          </div>
        </div>
      </div>

      {/* Collapse Button */}
      <Button
        type="button"
        variant="outline"
        size="icon"
        onClick={() => setIsCollapsed((previous) => !previous)}
        aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        className="absolute -right-3 top-[18px] z-20 size-6 rounded-full border bg-background shadow-sm transition-all hover:bg-muted"
      >
        {isCollapsed ? (
          <ChevronRight className="size-3.5" />
        ) : (
          <ChevronLeft className="size-3.5" />
        )}
      </Button>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3 py-5">
        {navigation.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.href}
              to={item.href}
              title={isCollapsed ? item.title : undefined}
              className={({ isActive }) =>
                ` relative flex h-10 items-center rounded-lg text-sm font-medium transition-all duration-200 ${
                  isCollapsed ? "justify-center" : "gap-3 px-3"
                } ${
                  isActive
                    ? "bg-primary/10 text-primary border-l-4 border-l-primary"
                    : "text-muted-foreground hover:bg-muted/70 hover:text-foreground"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon
                    className={`size-[18px]  transition-transform duration-200 ${
                      isActive ? "text-primary" : "hover:scale-105"
                    }`}
                  />

                  <span
                    className={`overflow-hidden whitespace-nowrap transition-all duration-300 ${
                      isCollapsed ? "w-0 opacity-0" : "w-auto opacity-100"
                    }`}
                  >
                    {item.title}
                  </span>
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Bottom Section */}
      <div className="border-t p-3">
        <NavLink
          to="/settings"
          title={isCollapsed ? "Settings" : undefined}
          className={({ isActive }) =>
            ` relative flex h-10 items-center rounded-lg text-sm font-medium transition-all duration-200 ${
              isCollapsed ? "justify-center" : "gap-3 px-3"
            } ${
              isActive
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:bg-muted/70 hover:text-foreground"
            }`
          }
        >
          {({ isActive }) => (
            <>
              {isActive && (
                <span className="absolute left-0 h-5 w-0.5 rounded-full bg-primary" />
              )}

              <Settings className={"size-[18px]"} />

              <span
                className={`overflow-hidden whitespace-nowrap transition-all duration-300 ${
                  isCollapsed ? "w-0 opacity-0" : "w-auto opacity-100"
                }`}
              >
                Settings
              </span>
            </>
          )}
        </NavLink>
      </div>
    </aside>
  );
}
