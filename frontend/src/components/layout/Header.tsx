import { useState } from "react";
import { Bell, Menu } from "lucide-react";

import { Button } from "@/components/ui/button";
import MobileSidebar from "./MobileSidebar";

export default function Header() {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

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

        {/* Right */}
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="size-5" />
          </Button>
        </div>
      </header>

      <MobileSidebar
        open={mobileSidebarOpen}
        onOpenChange={setMobileSidebarOpen}
      />
    </>
  );
}
