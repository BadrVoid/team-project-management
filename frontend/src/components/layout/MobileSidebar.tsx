import { useState } from "react";
import {
  Compass,
  ChevronDown,
  FolderKanban,
  LayoutDashboard,
} from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

const NAVIGATION = [
  {
    title: "Workspace",
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

type MobileSidebarProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export default function MobileSidebar({
  open,
  onOpenChange,
}: MobileSidebarProps) {
  const location = useLocation();
  const isSpacesActive = location.pathname.startsWith("/spaces");

  const [isSpacesOpenManual, setIsSpacesOpenManual] = useState<boolean | null>(
    null,
  );
  const isSpacesOpen = isSpacesOpenManual ?? isSpacesActive;

  const toggleSpacesSubmenu = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsSpacesOpenManual((prev) => (prev === null ? !isSpacesActive : !prev));
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="w-72 bg-card p-0">
        <SheetHeader className="flex h-16 flex-row items-center border-b px-5">
          <div className="flex items-center gap-3">
            <div className="size-9 shrink-0 overflow-hidden rounded-xl">
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
            <SheetTitle className="text-base">TeamFlow</SheetTitle>
          </div>
        </SheetHeader>

        <nav className="flex flex-1 flex-col px-3 py-4 space-y-1">
          <NavLink
            to="/dashboard"
            onClick={() => onOpenChange(false)}
            className={({ isActive }) =>
              `flex h-10 items-center gap-3 rounded-lg px-3 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted/70 hover:text-foreground"
              }`
            }
          >
            <LayoutDashboard className="size-[18px] shrink-0" />
            <span>Dashboard</span>
          </NavLink>

          <div>
            <div
              className={`flex h-10 items-center rounded-lg text-sm font-medium transition-colors ${
                isSpacesActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted/70 hover:text-foreground"
              }`}
            >
              <NavLink
                to="/spaces"
                onClick={() => onOpenChange(false)}
                className="flex h-full min-w-0 flex-1 items-center gap-3 px-3"
              >
                <FolderKanban className="size-[18px] shrink-0" />
                <span>Spaces</span>
              </NavLink>

              <button
                type="button"
                onClick={toggleSpacesSubmenu}
                aria-label={isSpacesOpen ? "Collapse Spaces" : "Expand Spaces"}
                aria-expanded={isSpacesOpen}
                className="mr-2 flex size-7 shrink-0 items-center justify-center rounded-md transition-colors hover:bg-primary/20"
              >
                <ChevronDown
                  className={`size-4 transition-transform duration-200 ${
                    isSpacesOpen ? "rotate-180" : ""
                  }`}
                />
              </button>
            </div>

            <div
              className={`grid transition-[grid-template-rows,opacity] duration-300 ${
                isSpacesOpen
                  ? "grid-rows-[1fr] opacity-100"
                  : "grid-rows-[0fr] opacity-0"
              }`}
            >
              <div className="min-h-0 overflow-hidden">
                <div className="ml-6 mt-1 space-y-1 border-l border-border pl-3">
                  {SPACE_NAVIGATION.map((item) => {
                    const Icon = item.icon;
                    return (
                      <NavLink
                        key={item.href}
                        to={item.href}
                        end={item.href === "/spaces"}
                        onClick={() => onOpenChange(false)}
                        className={({ isActive }) =>
                          `flex h-9 items-center gap-2 rounded-lg px-3 text-sm transition-colors ${
                            isActive
                              ? "bg-primary/10 font-medium text-primary"
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
          </div>

          {NAVIGATION.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.href}
                to={item.href}
                onClick={() => onOpenChange(false)}
                className={({ isActive }) =>
                  `flex h-10 items-center gap-3 rounded-lg px-3 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-muted/70 hover:text-foreground"
                  }`
                }
              >
                <Icon className="size-[18px] shrink-0" />
                <span>{item.title}</span>
              </NavLink>
            );
          })}
        </nav>
      </SheetContent>
    </Sheet>
  );
}
