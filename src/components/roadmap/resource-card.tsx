"use client";

import { useState, useTransition } from "react";
import { ExternalLink, Clock, BadgeCheck, Check } from "lucide-react";
import { toggleResource } from "@/actions/roadmap/toggle-resource";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Typography } from "@/components/ui/typography";
import { useToast } from "@/components/ui/toast";
import { cn } from "@/lib/utils";
import type { RoadmapResourceView } from "@/lib/roadmap/roadmap-types";

interface ResourceCardProps {
  resource: RoadmapResourceView;
}

export function ResourceCard({ resource }: ResourceCardProps) {
  const { showToast } = useToast();
  const [isCompleted, setIsCompleted] = useState(resource.isCompleted);
  const [isPending, startTransition] = useTransition();

  function handleToggle() {
    const previous = isCompleted;
    setIsCompleted(!previous);
    startTransition(async () => {
      const result = await toggleResource(resource.id);
      if (!result.success) {
        setIsCompleted(previous);
        showToast(result.error ?? "Failed to update resource", "error");
        return;
      }
      setIsCompleted(result.isCompleted ?? !previous);
    });
  }

  return (
    <Card
      className={cn(
        "flex items-start gap-3 rounded-xl border p-4 shadow-none transition-colors",
        isCompleted ? "border-success/30 bg-success/5" : "border-border bg-white"
      )}
    >
      <button
        type="button"
        role="checkbox"
        aria-checked={isCompleted}
        aria-label={isCompleted ? `Mark ${resource.title} as not completed` : `Mark ${resource.title} as completed`}
        onClick={handleToggle}
        disabled={isPending}
        className={cn(
          "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50",
          isCompleted ? "border-success bg-success" : "border-input bg-white"
        )}
      >
        {isCompleted && <Check className="h-3 w-3 text-white" />}
      </button>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <Typography
            variant="bodySmall"
            className={cn("font-medium", isCompleted ? "text-muted-foreground line-through" : "text-foreground")}
          >
            {resource.title}
          </Typography>
          {resource.isOptional && (
            <Badge variant="subtle" size="sm">
              Optional
            </Badge>
          )}
        </div>

        <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
          <span>{resource.provider}</span>
          <span>·</span>
          <span>{resource.type}</span>
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" aria-hidden="true" />
            {resource.estimatedHours}h
          </span>
          <span className="flex items-center gap-1">
            <BadgeCheck className="h-3 w-3" aria-hidden="true" />
            {resource.isFree ? "Free" : "Paid"}
          </span>
        </div>

        
        <a
  href={resource.url}
  target="_blank"
  rel="noopener noreferrer"
  className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
>
  Open resource <ExternalLink className="h-3 w-3" aria-hidden="true" />
</a>
      </div>
    </Card>
  );
}