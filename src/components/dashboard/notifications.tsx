"use client";

import { Bell } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Typography } from "@/components/ui/typography";

export function Notifications() {
  return (
    <Card className="rounded-2xl border border-border bg-white p-6 shadow-sm">
      <Typography variant="title" as="h2" className="font-semibold text-foreground">
        Notifications
      </Typography>

      <div className="mt-4 flex flex-col items-center justify-center gap-2 py-6 text-center">
        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-secondary">
          <Bell className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
        </span>
        <Typography variant="bodySmall" className="text-muted-foreground">
          No notifications right now.
        </Typography>
        <Typography variant="caption" className="text-muted-foreground">
          You&apos;ll see updates here as they happen.
        </Typography>
      </div>
    </Card>
  );
}