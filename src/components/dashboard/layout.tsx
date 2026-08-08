"use client";

import * as React from "react";
import { Sidebar } from "@/components/dashboard/sidebar";
import { Header } from "@/components/dashboard/header";

interface DashboardShellProps {
  userName: string;
  userEmail: string;
  children: React.ReactNode;
}

export function DashboardShell({ userName, userEmail, children }: DashboardShellProps) {
  const [collapsed, setCollapsed] = React.useState(false);

  return (
    <div className="flex min-h-screen bg-secondary/30">
      <Sidebar collapsed={collapsed} onToggleCollapse={() => setCollapsed((prev) => !prev)} />
      <div className="flex min-w-0 flex-1 flex-col">
        <Header userName={userName} userEmail={userEmail} />
        <main className="flex-1 p-4 md:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}