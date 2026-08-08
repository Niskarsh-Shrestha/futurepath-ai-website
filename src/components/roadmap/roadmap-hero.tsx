import { Map, Clock, TrendingUp } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Typography } from "@/components/ui/typography";
import { ProgressRing } from "@/components/roadmap/progress-ring";
import type { RoadmapView } from "@/lib/roadmap/roadmap-types";

interface RoadmapHeroProps {
  roadmap: RoadmapView;
  careerName: string;
}

export function RoadmapHero({ roadmap, careerName }: RoadmapHeroProps) {
  return (
    <Card className="rounded-2xl border border-border bg-gradient-to-br from-primary/5 via-white to-white p-7 shadow-sm">
      <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-primary/10">
            <Map className="h-6 w-6 text-primary" aria-hidden="true" />
          </span>
          <div>
            <Badge variant="subtle" size="sm">
              {careerName}
            </Badge>
            <Typography variant="h3" as="h1" className="mt-1.5 font-bold text-foreground">
              {roadmap.title}
            </Typography>
          </div>
        </div>
        <ProgressRing percent={roadmap.overallProgress} size="lg" />
      </div>

      <Typography variant="bodySmall" className="mt-5 leading-relaxed text-muted-foreground">
        {roadmap.description}
      </Typography>

      <div className="mt-6 grid grid-cols-1 gap-4 border-t border-border pt-6 sm:grid-cols-3">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-secondary">
            <TrendingUp className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
          </span>
          <div>
            <Typography variant="caption" className="text-muted-foreground">
              Difficulty
            </Typography>
            <Typography variant="bodySmall" className="font-medium text-foreground">
              {roadmap.difficulty}
            </Typography>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-secondary">
            <Clock className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
          </span>
          <div>
            <Typography variant="caption" className="text-muted-foreground">
              Estimated Duration
            </Typography>
            <Typography variant="bodySmall" className="font-medium text-foreground">
              {roadmap.estimatedDuration}
            </Typography>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-secondary">
            <Map className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
          </span>
          <div>
            <Typography variant="caption" className="text-muted-foreground">
              Current Phase
            </Typography>
            <Typography variant="bodySmall" className="truncate font-medium text-foreground">
              {roadmap.currentPhase?.title ?? "All phases complete"}
            </Typography>
          </div>
        </div>
      </div>
    </Card>
  );
}