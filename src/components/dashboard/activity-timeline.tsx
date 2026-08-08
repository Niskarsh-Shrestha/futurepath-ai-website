"use client";

import { motion } from "framer-motion";
import { ClipboardCheck, UserCircle, Bot } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Typography } from "@/components/ui/typography";
import { Badge } from "@/components/ui/badge";

export interface ActivityEntry {
  id: string;
  title: string;
  timestamp: string;
  status: "completed" | "updated" | "generated";
}

const STATUS_CONFIG: Record<
  ActivityEntry["status"],
  { label: string; variant: "success" | "subtle" | "primary"; icon: typeof ClipboardCheck }
> = {
  completed: { label: "Completed", variant: "success", icon: UserCircle },
  updated: { label: "Updated", variant: "subtle", icon: ClipboardCheck },
  generated: { label: "Generated", variant: "primary", icon: Bot },
};

interface ActivityTimelineProps {
  activity: ActivityEntry[];
}

export function ActivityTimeline({ activity }: ActivityTimelineProps) {
  return (
    <Card className="rounded-2xl border border-border bg-white p-6 shadow-sm">
      <Typography variant="title" as="h2" className="font-semibold text-foreground">
        Recent Activity
      </Typography>

      {activity.length === 0 ? (
        <Typography variant="bodySmall" className="mt-4 text-muted-foreground">
          No activity yet — start an assessment to see updates here.
        </Typography>
      ) : (
        <ol className="mt-5 space-y-5">
          {activity.map((item, index) => {
            const status = STATUS_CONFIG[item.status];
            const isLast = index === activity.length - 1;
            return (
              <motion.li
                key={item.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.06 }}
                className="relative flex gap-4 pb-1"
              >
                {!isLast && (
                  <span className="absolute left-5 top-11 h-[calc(100%-0.5rem)] w-px bg-border" aria-hidden="true" />
                )}
                <span className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
                  <status.icon className="h-4.5 w-4.5 text-primary" aria-hidden="true" />
                </span>
                <div className="flex-1 pt-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <Typography variant="bodySmall" className="font-medium text-foreground">
                      {item.title}
                    </Typography>
                    <Badge variant={status.variant} size="sm">
                      {status.label}
                    </Badge>
                  </div>
                  <Typography variant="caption" className="mt-0.5 block text-muted-foreground">
                    {item.timestamp}
                  </Typography>
                </div>
              </motion.li>
            );
          })}
        </ol>
      )}
    </Card>
  );
}