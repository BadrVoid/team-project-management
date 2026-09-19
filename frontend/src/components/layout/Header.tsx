import { useState } from "react";

import { Bell, Menu, Moon, Settings, Sun , UserRoundPen} from "lucide-react";

import { useTheme } from "next-themes";

import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";

import MobileSidebar from "./MobileSidebar";

export default function Header() {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const { resolvedTheme, setTheme } = useTheme();

  const navigate = useNavigate();

  const isDark = resolvedTheme === "dark";

  const toggleTheme = () => {
    setTheme(isDark ? "light" : "dark");
  };

  return (
    <>
      <header className="flex h-16 shrink-0 items-center justify-between border-b bg-card px-4 md:px-6">
        {/* Left */}
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

          <div>
            <h2 className="text-lg font-semibold">Dashboard</h2>
          </div>
        </div>

        {/* Right Action Bar */}
        <div className="flex items-center gap-3">
          {/* Theme Toggle */}
          <button
            type="button"
            onClick={toggleTheme}
            aria-label="Toggle light and dark theme"
            className="group flex items-center"
          >
            <div className="relative flex h-8 w-16 items-center justify-between rounded-full border border-border/80 bg-muted/90 p-1 shadow-[inset_0_2px_4px_rgba(0,0,0,0.2)] transition-all duration-300 dark:shadow-[inset_0_2px_4px_rgba(0,0,0,0.6)]">
              <Sun className="ml-0.5 size-3.5 text-amber-500/70 transition-opacity dark:text-muted-foreground/40" />

              <Moon className="mr-0.5 size-3.5 text-muted-foreground/40 transition-opacity dark:text-sky-400/80" />

              {/* Sliding Knob */}
              <div
                className={`absolute left-1 top-1 flex size-6 items-center justify-center rounded-full border border-border/40 bg-card shadow-[0_3px_8px_rgba(0,0,0,0.3)] transition-transform duration-300 ease-out ${
                  isDark ? "translate-x-8" : "translate-x-0"
                }`}
              >
                {isDark ? (
                  <Moon className="size-3.5 text-sky-400 transition-all duration-300" />
                ) : (
                  <Sun className="size-3.5 text-amber-500 transition-all duration-300" />
                )}
              </div>
            </div>
          </button>

          {/* Profile */}
          <button
            type="button"
            aria-label="Settings"
            onClick={() => navigate("/profile")}
            className="group flex size-9 items-center justify-center rounded-full border border-border/80 bg-muted/90 shadow-[inset_0_2px_4px_rgba(0,0,0,0.2)] transition-all duration-300 hover:border-border hover:bg-muted dark:shadow-[inset_0_2px_4px_rgba(0,0,0,0.6)] focus:outline-none"
          >
            <UserRoundPen className="size-4 text-muted-foreground transition-colors group-hover:text-foreground" />
          </button>

          {/* Settings */}
          <button
            type="button"
            aria-label="Settings"
            onClick={() => navigate("/settings")}
            className="group flex size-9 items-center justify-center rounded-full border border-border/80 bg-muted/90 shadow-[inset_0_2px_4px_rgba(0,0,0,0.2)] transition-all duration-300 hover:border-border hover:bg-muted dark:shadow-[inset_0_2px_4px_rgba(0,0,0,0.6)] focus:outline-none"
          >
            <Settings className="size-4 text-muted-foreground transition-colors group-hover:text-foreground" />
          </button>

          {/* Notifications */}
          <button
            type="button"
            aria-label="Notifications"
            onClick={() => navigate("/notifications")}
            className="group relative flex size-9 items-center justify-center rounded-full border border-border/80 bg-muted/90 p-1 shadow-[inset_0_2px_4px_rgba(0,0,0,0.2)] transition-all duration-300 hover:border-border hover:bg-muted dark:shadow-[inset_0_2px_4px_rgba(0,0,0,0.6)] focus:outline-none"
          >
            <Bell className="size-4 text-muted-foreground transition-colors group-hover:text-foreground" />
          </button>
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
