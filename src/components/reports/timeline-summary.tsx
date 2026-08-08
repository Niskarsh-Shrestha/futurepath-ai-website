import { CheckCircle2, Circle } from "lucide-react";
import { Typography } from "@/components/ui/typography";
import { cn } from "@/lib/utils";
import type { RoadmapView } from "@/lib/roadmap/roadmap-types";

interface TimelineSummaryProps {
  roadmap: RoadmapView;
}

/**
 * A compact recap of the roadmap for the report page — not the full
 * interactive RoadmapTimeline from Task 10, just phase titles +
 * completion state, since the report is a summary/recap surface, not
 * the working roadmap UI itself.
 */
export function TimelineSummary({ roadmap }: TimelineSummaryProps) {
  return (
    <div className="space-y-0">
      {roadmap.phases.map((phase, index) => (
        <div key={phase.id} className="relative flex gap-4 pb-6 last:pb-0">
          {index < roadmap.phases.length - 1 && (
            <span className="absolute left-[11px] top-6 h-full w-px bg-border" aria-hidden="true" />
          )}
          <span className="relative z-10 mt-0.5 shrink-0">
            {phase.isComplete ? (
              <CheckCircle2 className="h-6 w-6 text-success" aria-hidden="true" />
            ) : (
              <Circle className={cn("h-6 w-6", phase === roadmap.currentPhase ? "text-primary" : "text-border")} aria-hidden="true" />
            )}
          </span>
          <div className="pt-0.5">
            <Typography
              variant="bodySmall"
              className={cn("font-semibold", phase.isComplete ? "text-foreground" : "text-muted-foreground")}
            >
              {phase.title}
            </Typography>
            <Typography variant="caption" className="mt-0.5 text-muted-foreground">
              {phase.isComplete ? "Complete" : `${phase.progressPercent}% complete · ${phase.estimatedWeeks} weeks`}
            </Typography>
          </div>
        </div>
      ))}
    </div>
  );
}