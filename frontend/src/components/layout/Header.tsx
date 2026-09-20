import { useEffect, useRef, useState } from "react";

import {
  Bell,
  Check,
  LogOut,
  Menu,
  Moon,
  Settings,
  Sun,
  UserRoundPen,
} from "lucide-react";
import { useTheme } from "next-themes";
import { useLocation, useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { useUnreadNotificationCount } from "@/hooks/useNotifications";

import MobileSidebar from "./MobileSidebar";

const ACCENT_KEY = "accent";

const accents = [
  {
    name: "Green",
    value: "green",
    color: "#3f7d5a",
  },
  {
    name: "Blue",
    value: "blue",
    color: "#3b82f6",
  },
  {
    name: "Purple",
    value: "purple",
    color: "#8b5cf6",
  },
  {
    name: "Orange",
    value: "orange",
    color: "#f97316",
  },
  {
    name: "Rose",
    value: "rose",
    color: "#e11d48",
  },
  {
    name: "Cyan",
    value: "cyan",
    color: "#0891b2",
  },
];

const pageTitles: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/spaces": "Spaces",
  "/projects": "Projects",
  "/teams": "Teams",
  "/tasks": "Tasks",
  "/notifications": "Notifications",
  "/profile": "Profile",
  "/settings": "Settings",
  "/workspace": "WorkSpace",
};

export default function Header() {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [accent, setAccent] = useState("green");

  const profileMenuRef = useRef<HTMLDivElement>(null);

  const { resolvedTheme, setTheme } = useTheme();
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const isDark = resolvedTheme === "dark";

  const pageTitle = pageTitles[location.pathname];

  /* ========================================================
     THEME
     ======================================================== */

  const toggleTheme = () => {
    setTheme(isDark ? "light" : "dark");
  };

  /* ========================================================
     ACCENT
     ======================================================== */

  const changeAccent = (value: string) => {
    setAccent(value);
    document.documentElement.dataset.accent = value;
    localStorage.setItem(ACCENT_KEY, value);
  };

  /* ========================================================
     LOAD SAVED ACCENT
     ======================================================== */

  useEffect(() => {
    const savedAccent = localStorage.getItem(ACCENT_KEY) || "green";

    setAccent(savedAccent);
    document.documentElement.dataset.accent = savedAccent;
  }, []);

  /* ========================================================
     CLOSE PROFILE MENU
     ======================================================== */

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target as Node)
      ) {
        setProfileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  /* ========================================================
     LOGOUT
     ======================================================== */

  const handleLogout = async () => {
    setProfileMenuOpen(false);

    await logout();

    navigate("/auth", { replace: true });
  };

  return (
    <>
      <header className="flex h-16 shrink-0 items-center justify-between border-b bg-card px-4 md:px-6">
        {/* ==================================================
            LEFT
            ================================================== */}

        <div className="flex items-center gap-3">
          {/* Mobile Menu */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileSidebarOpen(true)}
            aria-label="Open navigation"
          >
            <Menu className="size-5" />
          </Button>

          {/* Page Title */}
          <div>
            {pageTitle && (
              <h2 className="text-lg font-semibold">{pageTitle}</h2>
            )}
          </div>
        </div>

        {/* ==================================================
            RIGHT
            ================================================== */}

        <div className="flex items-center gap-3">
          {/* ==================================================
              THEME TOGGLE
              ================================================== */}

          <button
            type="button"
            onClick={toggleTheme}
            aria-label="Toggle light and dark theme"
            className="group flex items-center"
          >
            <div className="relative flex h-8 w-16 items-center justify-between rounded-full border border-border/80 bg-muted/90 p-1 shadow-[inset_0_2px_4px_rgba(0,0,0,0.2)] transition-all duration-300 dark:shadow-[inset_0_2px_4px_rgba(0,0,0,0.6)]">
              <Sun className="ml-0.5 size-3.5 text-amber-500/70 transition-opacity dark:text-muted-foreground/40" />

              <Moon className="mr-0.5 size-3.5 text-muted-foreground/40 transition-opacity dark:text-sky-400/80" />

              <div
                className={`absolute left-1 top-1 flex size-6 items-center justify-center rounded-full border border-border/40 bg-card shadow-[0_3px_8px_rgba(0,0,0,0.3)] transition-transform duration-300 ease-out ${
                  isDark ? "translate-x-8" : "translate-x-0"
                }`}
              >
                {isDark ? (
                  <Moon className="size-3.5 text-sky-400" />
                ) : (
                  <Sun className="size-3.5 text-amber-500" />
                )}
              </div>
            </div>
          </button>

          {/* ==================================================
              PROFILE MENU
              ================================================== */}

          <div ref={profileMenuRef} className="relative">
            <button
              type="button"
              aria-label="Profile menu"
              aria-expanded={profileMenuOpen}
              onClick={() => setProfileMenuOpen((prev) => !prev)}
              className="group flex size-9 items-center justify-center rounded-full border border-border/80 bg-muted/90 shadow-[inset_0_2px_4px_rgba(0,0,0,0.2)] transition-all duration-300 hover:border-border hover:bg-muted dark:shadow-[inset_0_2px_4px_rgba(0,0,0,0.6)] focus:outline-none"
            >
              <UserRoundPen className="size-4 text-muted-foreground transition-colors group-hover:text-foreground" />
            </button>

            {profileMenuOpen && (
              <div className="absolute right-0 top-12 z-50 w-64 overflow-hidden rounded-xl border bg-card p-1.5 shadow-lg">
                {/* Profile */}
                <button
                  type="button"
                  onClick={() => {
                    setProfileMenuOpen(false);
                    navigate("/profile");
                  }}
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                  <UserRoundPen className="size-4" />
                  Profile
                </button>

                {/* Settings */}
                <button
                  type="button"
                  onClick={() => {
                    setProfileMenuOpen(false);
                    navigate("/settings");
                  }}
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                  <Settings className="size-4" />
                  Settings
                </button>

                {/* ==================================================
                    ACCENT COLORS
                    ================================================== */}

                <div className="my-1 border-t" />

                <div className="px-3 py-2">
                  <p className="mb-2 text-xs font-medium text-muted-foreground">
                    Accent Color
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {accents.map((item) => {
                      const isSelected = accent === item.value;

                      return (
                        <button
                          key={item.value}
                          type="button"
                          onClick={() => {
                            changeAccent(item.value);
                            setProfileMenuOpen(false);
                          }}
                          aria-label={`Choose ${item.name} accent`}
                          title={item.name}
                          className={`relative flex size-7 items-center justify-center rounded-full border-2 transition-all duration-200 hover:scale-110 ${
                            isSelected
                              ? "border-foreground ring-2 ring-primary/30 ring-offset-2 ring-offset-card"
                              : "border-transparent"
                          }`}
                          style={{
                            backgroundColor: item.color,
                          }}
                        >
                          {isSelected && (
                            <Check className="size-3.5 text-white drop-shadow-sm" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Logout */}
                <div className="my-1 border-t" />

                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-destructive transition-colors hover:bg-destructive/10"
                >
                  <LogOut className="size-4" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Mobile Sidebar */}
      <MobileSidebar
        open={mobileSidebarOpen}
        onOpenChange={setMobileSidebarOpen}
      />
    </>
  );
}
