import { CheckCircle2, Circle, Flag } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Typography } from "@/components/ui/typography";
import type { RoadmapView } from "@/lib/roadmap/roadmap-types";

interface RoadmapProgressProps {
  roadmap: RoadmapView;
}

export function RoadmapProgress({ roadmap }: RoadmapProgressProps) {
  const completedPhases = roadmap.phases.filter((p) => p.isComplete).length;
  const remainingPhases = roadmap.phases.length - completedPhases;

  return (
    <Card className="rounded-2xl border border-border bg-white p-6 shadow-sm">
      <Typography variant="title" as="h2" className="font-semibold text-foreground">
        Progress Overview
      </Typography>

      <div className="mt-4 h-2 overflow-hidden rounded-full bg-secondary">
        <div
          className="h-full rounded-full bg-primary transition-all duration-700"
          style={{ width: `${roadmap.overallProgress}%` }}
        />
      </div>
      <Typography variant="caption" className="mt-1.5 block text-muted-foreground">
        {roadmap.overallProgress}% complete overall
      </Typography>

      <div className="mt-5 grid grid-cols-2 gap-4">
        <div className="flex items-center gap-2.5 rounded-xl bg-secondary/50 p-3.5">
          <CheckCircle2 className="h-4.5 w-4.5 text-success" aria-hidden="true" />
          <div>
            <Typography variant="bodySmall" className="font-semibold text-foreground">
              {completedPhases}
            </Typography>
            <Typography variant="caption" className="text-muted-foreground">
              Phases done
            </Typography>
          </div>
        </div>
        <div className="flex items-center gap-2.5 rounded-xl bg-secondary/50 p-3.5">
          <Circle className="h-4.5 w-4.5 text-muted-foreground" aria-hidden="true" />
          <div>
            <Typography variant="bodySmall" className="font-semibold text-foreground">
              {remainingPhases}
            </Typography>
            <Typography variant="caption" className="text-muted-foreground">
              Remaining
            </Typography>
          </div>
        </div>
      </div>

      {roadmap.nextMilestone && (
        <div className="mt-4 flex items-start gap-2.5 rounded-xl border border-primary/20 bg-primary/5 p-3.5">
          <Flag className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
          <div>
            <Typography variant="caption" className="font-semibold uppercase tracking-wider text-primary">
              Next Milestone
            </Typography>
            <Typography variant="bodySmall" className="mt-0.5 font-medium text-foreground">
              {roadmap.nextMilestone.title}
            </Typography>
          </div>
        </div>
      )}
    </Card>
  );
}