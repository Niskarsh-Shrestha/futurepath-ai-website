"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Typography } from "@/components/ui/typography";
import { cn } from "@/lib/utils";

interface SkillGap {
  id: string;
  skill: string;
  currentLevel: number;
  requiredLevel: number;
  priority: string;
}

interface SkillGapCardProps {
  skillGaps: SkillGap[];
}

function getPriorityBadgeVariant(priority: string): "subtle" | "warning" | "destructive" {
  switch (priority) {
    case "High":
      return "destructive";
    case "Medium":
      return "warning";
    default:
      return "subtle";
  }
}

export function SkillGapCard({ skillGaps }: SkillGapCardProps) {
  return (
    <Card className="rounded-2xl border border-border bg-white p-6 shadow-sm">
      <Typography variant="title" as="h3" className="font-semibold text-foreground">
        Skill Development
      </Typography>
      <Typography variant="bodySmall" className="mt-1 text-muted-foreground">
        Current level vs. what&apos;s typically expected in this field
      </Typography>

      <div className="mt-5 space-y-5">
        {skillGaps.map((gap) => (
          <div key={gap.id}>
            <div className="flex items-center justify-between gap-2">
              <Typography variant="bodySmall" className="font-medium text-foreground">
                {gap.skill}
              </Typography>
              <Badge variant={getPriorityBadgeVariant(gap.priority)} size="sm">
                {gap.priority} priority
              </Badge>
            </div>
            <div className="relative mt-2 h-2 w-full overflow-hidden rounded-full bg-secondary">
              <div
                className="absolute inset-y-0 left-0 rounded-full bg-border/80"
                style={{ width: `${gap.requiredLevel}%` }}
              />
              <motion.div
                className={cn("absolute inset-y-0 left-0 rounded-full bg-primary")}
                initial={{ width: 0 }}
                animate={{ width: `${gap.currentLevel}%` }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              />
              <span
                className="absolute top-1/2 h-3 w-0.5 -translate-y-1/2 bg-foreground/40"
                style={{ left: `${gap.requiredLevel}%` }}
                aria-hidden="true"
              />
            </div>
            <div className="mt-1 flex justify-between">
              <Typography variant="caption" className="text-muted-foreground">
                Current: {gap.currentLevel}%
              </Typography>
              <Typography variant="caption" className="text-muted-foreground">
                Typical: {gap.requiredLevel}%
              </Typography>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}