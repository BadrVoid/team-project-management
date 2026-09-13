import {
  Bell,
  CheckSquare,
  FolderKanban,
  LayoutDashboard,
  Settings,
  Users,
} from "lucide-react";
import { NavLink } from "react-router-dom";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

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

type MobileSidebarProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export default function MobileSidebar({
  open,
  onOpenChange,
}: MobileSidebarProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="w-72 p-0 bg-white">
        {/* Header */}
        <SheetHeader className="flex h-16 flex-row items-center border-b px-5">
          <div className="flex items-center gap-3">
            {/* Logo */}
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

        {/* Navigation */}
        <nav className="flex flex-1 flex-col px-3 py-3">
          <div className="space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.href}
                  to={item.href}
                  onClick={() => onOpenChange(false)}
                  className={({ isActive }) =>
                    `relative flex h-10 items-center gap-3 rounded-lg px-3 text-sm font-medium transition-colors ${
                      isActive
                        ? "border-l-2 border-l-primary bg-primary/10 text-primary"
                        : "text-muted-foreground hover:bg-muted/70 hover:text-foreground"
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <Icon
                        className={`size-[18px] shrink-0 ${
                          isActive ? "text-primary" : ""
                        }`}
                      />

                      <span>{item.title}</span>
                    </>
                  )}
                </NavLink>
              );
            })}
          </div>

          {/* Settings */}
          <div className="mt-auto border-t pt-4">
            <NavLink
              to="/settings"
              onClick={() => onOpenChange(false)}
              className={({ isActive }) =>
                `flex h-10 items-center gap-3 rounded-lg px-3 text-sm font-medium transition-colors ${
                  isActive
                    ? "border-l-2 border-l-primary bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted/70 hover:text-foreground"
                }`
              }
            >
              <Settings className="size-[18px] shrink-0" />
              Settings
            </NavLink>
          </div>
        </nav>
      </SheetContent>
    </Sheet>
  );
}
