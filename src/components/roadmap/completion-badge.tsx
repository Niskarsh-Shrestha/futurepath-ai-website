import { Circle, Clock, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export type CompletionState = "not_started" | "in_progress" | "completed";

interface CompletionBadgeProps {
  state: CompletionState;
  size?: "sm" | "md";
}

const STATE_CONFIG: Record<CompletionState, { label: string; icon: typeof Circle; variant: "subtle" | "warning" | "success" }> = {
  not_started: { label: "Not Started", icon: Circle, variant: "subtle" },
  in_progress: { label: "In Progress", icon: Clock, variant: "warning" },
  completed: { label: "Completed", icon: CheckCircle2, variant: "success" },
};

export function CompletionBadge({ state, size = "md" }: CompletionBadgeProps) {
  const config = STATE_CONFIG[state];
  return (
    <Badge variant={config.variant} size={size} className="inline-flex items-center gap-1.5">
      <config.icon className="h-3 w-3" aria-hidden="true" />
      {config.label}
    </Badge>
  );
}

/** Derives a CompletionState from a phase's isComplete + progressPercent (from timeline.ts's RoadmapPhaseView). */
export function getCompletionState(isComplete: boolean, progressPercent: number): CompletionState {
  if (isComplete) return "completed";
  if (progressPercent > 0) return "in_progress";
  return "not_started";
}