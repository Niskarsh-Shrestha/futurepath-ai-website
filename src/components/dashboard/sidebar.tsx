"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut, Sparkles, ChevronsLeft, ChevronsRight } from "lucide-react";
import { signOut } from "next-auth/react";
import { SIDEBAR_NAV } from "@/lib/mock/dashboard";
import { cn } from "@/lib/utils";

interface SidebarContentProps {
  collapsed?: boolean;
  onNavigate?: () => void;
}

function SidebarLinks({ collapsed, onNavigate }: SidebarContentProps) {
  const pathname = usePathname();

  return (
    <nav className="flex-1 space-y-1 px-3" aria-label="Dashboard navigation">
      {SIDEBAR_NAV.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            aria-current={isActive ? "page" : undefined}
            className={cn(
              "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              isActive
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:bg-secondary hover:text-foreground"
            )}
          >
            <item.icon className="h-4.5 w-4.5 shrink-0" aria-hidden="true" />
            {!collapsed && <span>{item.label}</span>}
          </Link>
        );
      })}
    </nav>
  );
}

interface SidebarProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
}

export function Sidebar({ collapsed, onToggleCollapse }: SidebarProps) {
  return (
    <aside
      className={cn(
        "hidden h-screen shrink-0 flex-col border-r border-border bg-white transition-all duration-300 md:flex",
        collapsed ? "w-20" : "w-64"
      )}
    >
      <div className="flex h-16 items-center gap-2.5 border-b border-border px-4">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10">
          <Sparkles className="h-4.5 w-4.5 text-primary" aria-hidden="true" />
        </span>
        {!collapsed && <span className="text-base font-bold text-foreground">FuturePath AI</span>}
      </div>

      <div className="flex flex-1 flex-col justify-between overflow-y-auto py-4">
        <SidebarLinks collapsed={collapsed} />

        <div className="space-y-1 px-3">
          <button
            type="button"
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-destructive focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <LogOut className="h-4.5 w-4.5 shrink-0" aria-hidden="true" />
            {!collapsed && <span>Logout</span>}
          </button>

          <button
            type="button"
            onClick={onToggleCollapse}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {collapsed ? (
              <ChevronsRight className="h-4.5 w-4.5 shrink-0" aria-hidden="true" />
            ) : (
              <>
                <ChevronsLeft className="h-4.5 w-4.5 shrink-0" aria-hidden="true" />
                <span>Collapse</span>
              </>
            )}
          </button>
        </div>
      </div>
    </aside>
  );
}

export function MobileSidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <div className="flex h-full flex-col">
      <div className="flex h-16 items-center gap-2.5 border-b border-border px-4">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10">
          <Sparkles className="h-4.5 w-4.5 text-primary" aria-hidden="true" />
        </span>
        <span className="text-base font-bold text-foreground">FuturePath AI</span>
      </div>
      <div className="flex flex-1 flex-col justify-between overflow-y-auto py-4">
        <SidebarLinks onNavigate={onNavigate} />
        <div className="px-3">
          <button
            type="button"
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-destructive"
          >
            <LogOut className="h-4.5 w-4.5 shrink-0" aria-hidden="true" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
}