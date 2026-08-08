import type {
  RoadmapPhaseView,
  RoadmapMilestoneView,
  RoadmapResourceView,
  RoadmapView,
} from "@/lib/roadmap/roadmap-types";

function computePhaseProgress(
  resources: RoadmapResourceView[],
  milestones: RoadmapMilestoneView[]
): { isComplete: boolean; progressPercent: number } {
  const total = resources.length + milestones.length;
  if (total === 0) return { isComplete: true, progressPercent: 100 };

  const completed =
    resources.filter((r) => r.isCompleted).length + milestones.filter((m) => m.isCompleted).length;

  const progressPercent = Math.round((completed / total) * 100);
  return { isComplete: completed === total, progressPercent };
}

/**
 * Turns raw phase/resource/milestone rows (already loaded from Prisma)
 * into the derived RoadmapPhaseView shape — computing per-phase
 * completion/progress rather than storing it, so it can never drift
 * from the underlying resource/milestone completion state.
 */
export function buildPhaseView(phase: {
  id: string;
  title: string;
  description: string;
  order: number;
  estimatedWeeks: number;
  resources: RoadmapResourceView[];
  milestones: RoadmapMilestoneView[];
}): RoadmapPhaseView {
  const { isComplete, progressPercent } = computePhaseProgress(phase.resources, phase.milestones);
  return { ...phase, isComplete, progressPercent };
}

/**
 * Assembles the full derived RoadmapView: overall progress (equally
 * weighted across phases), current phase (first incomplete phase, or
 * the last phase if everything is done), and next milestone (first
 * incomplete milestone within the current phase).
 */
export function buildRoadmapView(roadmap: {
  id: string;
  recommendationId: string;
  title: string;
  description: string;
  estimatedDuration: string;
  difficulty: string;
  phases: Array<{
    id: string;
    title: string;
    description: string;
    order: number;
    estimatedWeeks: number;
    resources: RoadmapResourceView[];
    milestones: RoadmapMilestoneView[];
  }>;
}): RoadmapView {
  const sortedPhases = [...roadmap.phases].sort((a, b) => a.order - b.order);
  const phaseViews = sortedPhases.map(buildPhaseView);

  const overallProgress =
    phaseViews.length > 0
      ? Math.round(phaseViews.reduce((sum, p) => sum + p.progressPercent, 0) / phaseViews.length)
      : 0;

  const currentPhase = phaseViews.find((p) => !p.isComplete) ?? phaseViews[phaseViews.length - 1] ?? null;

  const nextMilestone = currentPhase
    ? currentPhase.milestones.find((m) => !m.isCompleted) ?? null
    : null;

  return {
    id: roadmap.id,
    recommendationId: roadmap.recommendationId,
    title: roadmap.title,
    description: roadmap.description,
    estimatedDuration: roadmap.estimatedDuration,
    difficulty: roadmap.difficulty as RoadmapView["difficulty"],
    phases: phaseViews,
    overallProgress,
    currentPhase,
    nextMilestone,
  };
}