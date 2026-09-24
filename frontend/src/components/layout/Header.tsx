import { useEffect, useRef, useState } from "react";
import {
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

import MobileSidebar from "./MobileSidebar";

const ACCENT_KEY = "accent";

const accents = [
  { name: "Green", value: "green", color: "#3f7d5a" },
  { name: "Blue", value: "blue", color: "#3b82f6" },
  { name: "Purple", value: "purple", color: "#8b5cf6" },
  { name: "Orange", value: "orange", color: "#f97316" },
  { name: "Rose", value: "rose", color: "#e11d48" },
  { name: "Cyan", value: "cyan", color: "#0891b2" },
];

const pageTitles: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/spaces": "Spaces",
  "/spaces/discover": "Discover Spaces",
  "/projects": "Projects",
  "/teams": "Teams",
  "/tasks": "Tasks",
  "/notifications": "Notifications",
  "/profile": "Profile",
  "/settings": "Settings",
  "/workspace": "Workspace",
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

  // Match root path or fallback to exact string matching
  const matchedRoute = Object.keys(pageTitles).find(
    (path) =>
      location.pathname === path ||
      (path !== "/" && location.pathname.startsWith(path)),
  );
  const pageTitle = matchedRoute ? pageTitles[matchedRoute] : "";

  const toggleTheme = () => setTheme(isDark ? "light" : "dark");

  const changeAccent = (value: string) => {
    setAccent(value);
    document.documentElement.dataset.accent = value;
    localStorage.setItem(ACCENT_KEY, value);
  };

  useEffect(() => {
    const savedAccent = localStorage.getItem(ACCENT_KEY) || "green";
    setAccent(savedAccent);
    document.documentElement.dataset.accent = savedAccent;
  }, []);

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
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    setProfileMenuOpen(false);
    await logout();
    navigate("/auth", { replace: true });
  };

  return (
    <>
      <header className="flex h-16 shrink-0 items-center justify-between border-b bg-card px-4 md:px-6">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileSidebarOpen(true)}
            aria-label="Open navigation menu"
          >
            <Menu className="size-5" />
          </Button>

          {pageTitle && (
            <h2 className="text-lg font-semibold tracking-tight">
              {pageTitle}
            </h2>
          )}
        </div>

        <div className="flex items-center gap-3">
          {/* Theme Switcher Toggle */}
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
            className="group flex items-center rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <div className="relative flex h-8 w-16 items-center justify-between rounded-full border border-border/80 bg-muted/90 p-1 shadow-[inset_0_2px_4px_rgba(0,0,0,0.15)] transition-colors">
              <Sun className="ml-0.5 size-3.5 text-amber-500/70 dark:text-muted-foreground/40" />
              <Moon className="mr-0.5 size-3.5 text-muted-foreground/40 dark:text-sky-400/80" />

              <div
                className={`absolute left-1 top-1 flex size-6 items-center justify-center rounded-full border border-border/40 bg-card shadow-sm transition-transform duration-300 ease-out ${
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

          {/* Profile Menu Trigger */}
          <div ref={profileMenuRef} className="relative">
            <button
              type="button"
              aria-label="User profile menu"
              aria-expanded={profileMenuOpen}
              aria-haspopup="true"
              onClick={() => setProfileMenuOpen((prev) => !prev)}
              className="group flex size-9 items-center justify-center rounded-full border border-border/80 bg-muted/90 transition-all hover:border-border hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <UserRoundPen className="size-4 text-muted-foreground transition-colors group-hover:text-foreground" />
            </button>

            {profileMenuOpen && (
              <div className="absolute right-0 top-12 z-50 w-64 overflow-hidden rounded-xl border bg-card p-1.5 shadow-lg">
                <button
                  type="button"
                  onClick={() => {
                    setProfileMenuOpen(false);
                    navigate("/profile");
                  }}
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                  <UserRoundPen className="size-4" />
                  Profile
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setProfileMenuOpen(false);
                    navigate("/settings");
                  }}
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                  <Settings className="size-4" />
                  Settings
                </button>

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
                          aria-label={`Set accent color to ${item.name}`}
                          title={item.name}
                          className={`relative flex size-7 items-center justify-center rounded-full border-2 transition-transform hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                            isSelected
                              ? "border-foreground ring-2 ring-primary/30 ring-offset-1"
                              : "border-transparent"
                          }`}
                          style={{ backgroundColor: item.color }}
                        >
                          {isSelected && (
                            <Check className="size-3.5 text-white drop-shadow-sm" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="my-1 border-t" />

                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-destructive transition-colors hover:bg-destructive/10"
                >
                  <LogOut className="size-4" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <MobileSidebar
        open={mobileSidebarOpen}
        onOpenChange={setMobileSidebarOpen}
      />
    </>
  );
}
