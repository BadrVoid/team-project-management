import { useEffect, useState } from "react";

import {
  Bell,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Compass,
  FolderKanban,
  LayoutDashboard,
} from "lucide-react";

import { NavLink, useLocation } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { useUnreadNotificationCount } from "@/hooks/useNotifications";

const NAVIGATION = [
  {
    title: "WorkSpace",
    href: "/workspace",
    icon: FolderKanban,
  },
];

const SPACE_NAVIGATION = [
  {
    title: "My Spaces",
    href: "/spaces",
    icon: FolderKanban,
  },
  {
    title: "Discover",
    href: "/spaces/discover",
    icon: Compass,
  },
];

export default function Sidebar() {
  const location = useLocation();

  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isSpacesOpen, setIsSpacesOpen] = useState(false);

  const { data: unreadCount = 0 } = useUnreadNotificationCount();

  const isSpacesActive = location.pathname.startsWith("/spaces");

  useEffect(() => {
    // Keep Spaces submenu open whenever the user is inside a Spaces route.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsSpacesOpen(isSpacesActive);
  }, [location.pathname, isSpacesActive]);

  return (
    <aside
      className={`relative hidden border-r bg-card transition-[width] duration-300 ease-in-out md:flex md:flex-col ${
        isCollapsed ? "w-20" : "w-64"
      }`}
    >
      {/* Header */}
      <div
        className={`flex h-16 items-center border-b ${
          isCollapsed ? "justify-center px-3" : "px-5"
        }`}
      >
        <div className="flex min-w-0 items-center gap-3">
          {/* Logo */}
          <div className="size-9 shrink-0 overflow-hidden rounded-xl shadow-[0_2px_6px_rgba(0,0,0,0.2)]">
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

      {/* Collapse Toggle */}
      <Button
        type="button"
        variant="outline"
        size="icon"
        onClick={() => setIsCollapsed((prev) => !prev)}
        className="absolute -right-3 top-[18px] z-20 size-6 rounded-full border bg-background shadow-[0_2px_5px_rgba(0,0,0,0.15)] transition-all hover:scale-105"
      >
        {isCollapsed ? (
          <ChevronRight className="size-3.5" />
        ) : (
          <ChevronLeft className="size-3.5" />
        )}
      </Button>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3 py-5">
        {/* Dashboard */}
        <NavLink
          to="/dashboard"
          title={isCollapsed ? "Dashboard" : undefined}
          className={({ isActive }) =>
            `relative flex h-10 items-center rounded-xl text-sm font-medium transition-all duration-200 ${
              isCollapsed ? "justify-center" : "gap-3 px-3"
            } ${
              isActive
                ? "border border-primary/20 bg-primary/10 text-primary shadow-[inset_0_2px_4px_rgba(0,0,0,0.15)] dark:shadow-[inset_0_2px_4px_rgba(0,0,0,0.5)]"
                : "text-muted-foreground hover:bg-muted/70 hover:text-foreground"
            }`
          }
        >
          <LayoutDashboard className="size-[18px] shrink-0" />

          <span
            className={`overflow-hidden whitespace-nowrap transition-all duration-300 ${
              isCollapsed ? "w-0 opacity-0" : "w-auto opacity-100"
            }`}
          >
            Dashboard
          </span>
        </NavLink>

        {/* Spaces */}
        <div>
          <div
            className={`relative flex h-10 items-center rounded-xl text-sm font-medium transition-all duration-200 ${
              isCollapsed ? "justify-center" : "gap-3 px-3"
            } ${
              isSpacesActive
                ? "border border-primary/20 bg-primary/10 text-primary shadow-[inset_0_2px_4px_rgba(0,0,0,0.15)] dark:shadow-[inset_0_2px_4px_rgba(0,0,0,0.5)]"
                : "text-muted-foreground hover:bg-muted/70 hover:text-foreground"
            }`}
          >
            <NavLink
              to="/spaces"
              title={isCollapsed ? "Spaces" : undefined}
              className={`relative flex h-full min-w-0 flex-1 items-center ${
                isCollapsed ? "justify-center" : "gap-3"
              }`}
            >
              <FolderKanban className="size-[18px] shrink-0" />

              <span
                className={`overflow-hidden whitespace-nowrap transition-all duration-300 ${
                  isCollapsed ? "w-0 opacity-0" : "w-auto opacity-100"
                }`}
              >
                Spaces
              </span>
            </NavLink>

            {!isCollapsed && (
              <button
                type="button"
                onClick={() => setIsSpacesOpen((prev) => !prev)}
                aria-label={isSpacesOpen ? "Collapse Spaces" : "Expand Spaces"}
                className="flex size-7 shrink-0 items-center justify-center rounded-lg transition-colors hover:bg-primary/20"
              >
                <ChevronDown
                  className={`size-4 transition-transform duration-200 ${
                    isSpacesOpen ? "rotate-180" : ""
                  }`}
                />
              </button>
            )}
          </div>

          {/* Spaces submenu */}
          {!isCollapsed && (
            <div
              className={`grid transition-all duration-300 ${
                isSpacesOpen
                  ? "grid-rows-[1fr] opacity-100"
                  : "grid-rows-[0fr] opacity-0"
              }`}
            >
              <div className="min-h-0 overflow-hidden">
                <div className="ml-6 mt-1.5 space-y-1 pl-3">
                  {SPACE_NAVIGATION.map((item) => {
                    const Icon = item.icon;

                    return (
                      <NavLink
                        key={item.href}
                        to={item.href}
                        end={item.href === "/spaces"}
                        className={({ isActive }) =>
                          `flex h-9 items-center gap-2 rounded-lg px-3 text-sm transition-all duration-200 ${
                            isActive
                              ? "border border-primary/20 bg-primary/10 text-primary shadow-[inset_0_2px_4px_rgba(0,0,0,0.15)] dark:shadow-[inset_0_2px_4px_rgba(0,0,0,0.5)]"
                              : "text-muted-foreground hover:bg-muted/70 hover:text-foreground"
                          }`
                        }
                      >
                        <Icon className="size-4 shrink-0" />

                        <span>{item.title}</span>
                      </NavLink>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Workspace */}
        {NAVIGATION.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.href}
              to={item.href}
              title={isCollapsed ? item.title : undefined}
              className={({ isActive }) =>
                `relative flex h-10 items-center rounded-xl text-sm font-medium transition-all duration-200 ${
                  isCollapsed ? "justify-center" : "gap-3 px-3"
                } ${
                  isActive
                    ? "border border-primary/20 bg-primary/10 text-primary shadow-[inset_0_2px_4px_rgba(0,0,0,0.15)] dark:shadow-[inset_0_2px_4px_rgba(0,0,0,0.5)]"
                    : "text-muted-foreground hover:bg-muted/70 hover:text-foreground"
                }`
              }
            >
              <Icon className="size-[18px] shrink-0" />

              <span
                className={`overflow-hidden whitespace-nowrap transition-all duration-300 ${
                  isCollapsed ? "w-0 opacity-0" : "w-auto opacity-100"
                }`}
              >
                {item.title}
              </span>
            </NavLink>
          );
        })}

        {/* Notifications */}
        <NavLink
          to="/notifications"
          title={isCollapsed ? "Notifications" : undefined}
          className={({ isActive }) =>
            `relative flex h-10 items-center rounded-xl text-sm font-medium transition-all duration-200 ${
              isCollapsed ? "justify-center" : "gap-3 px-3"
            } ${
              isActive
                ? "border border-primary/20 bg-primary/10 text-primary shadow-[inset_0_2px_4px_rgba(0,0,0,0.15)] dark:shadow-[inset_0_2px_4px_rgba(0,0,0,0.5)]"
                : "text-muted-foreground hover:bg-muted/70 hover:text-foreground"
            }`
          }
        >
          <Bell className="size-[18px] shrink-0" />

          <span
            className={`overflow-hidden whitespace-nowrap transition-all duration-300 ${
              isCollapsed ? "w-0 opacity-0" : "w-auto opacity-100"
            }`}
          >
            Notifications
          </span>

          {unreadCount > 0 && (
            <span
              className={`flex items-center justify-center rounded-full bg-destructive px-1.5 text-[10px] font-semibold leading-4 text-destructive-foreground ${
                isCollapsed
                  ? "absolute right-1 top-1 min-w-4"
                  : "ml-auto min-w-5"
              }`}
            >
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          )}
        </NavLink>
      </nav>
    </aside>
  );
}
