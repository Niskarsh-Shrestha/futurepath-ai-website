"use client";

import { useState, useTransition } from "react";
import { Check } from "lucide-react";
import { toggleMilestone } from "@/actions/roadmap/toggle-milestone";
import { Typography } from "@/components/ui/typography";
import { useToast } from "@/components/ui/toast";
import { cn } from "@/lib/utils";
import type { RoadmapMilestoneView } from "@/lib/roadmap/roadmap-types";

interface MilestoneCardProps {
  milestone: RoadmapMilestoneView;
}

export function MilestoneCard({ milestone }: MilestoneCardProps) {
  const { showToast } = useToast();
  const [isCompleted, setIsCompleted] = useState(milestone.isCompleted);
  const [isPending, startTransition] = useTransition();

  function handleToggle() {
    const previous = isCompleted;
    setIsCompleted(!previous);
    startTransition(async () => {
      const result = await toggleMilestone(milestone.id);
      if (!result.success) {
        setIsCompleted(previous);
        showToast(result.error ?? "Failed to update milestone", "error");
        return;
      }
      setIsCompleted(result.isCompleted ?? !previous);
    });
  }

  return (
    <div
      className={cn(
        "flex items-start gap-3 rounded-xl border p-4 transition-colors",
        isCompleted ? "border-primary/30 bg-primary/5" : "border-border bg-white"
      )}
    >
      <button
        type="button"
        role="checkbox"
        aria-checked={isCompleted}
        aria-label={isCompleted ? `Mark ${milestone.title} as not completed` : `Mark ${milestone.title} as completed`}
        onClick={handleToggle}
        disabled={isPending}
        className={cn(
          "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50",
          isCompleted ? "border-primary bg-primary" : "border-input bg-white"
        )}
      >
        {isCompleted && <Check className="h-3 w-3 text-white" />}
      </button>

      <div className="min-w-0 flex-1">
        <Typography
          variant="bodySmall"
          className={cn("font-medium", isCompleted ? "text-muted-foreground line-through" : "text-foreground")}
        >
          {milestone.title}
        </Typography>
        <Typography variant="caption" className="mt-0.5 leading-relaxed text-muted-foreground">
          {milestone.description}
        </Typography>
      </div>
    </div>
  );
}