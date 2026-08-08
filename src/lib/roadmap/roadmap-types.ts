export type LearningResourceType =
  | "Book"
  | "Online Course"
  | "Video"
  | "Website"
  | "Certification"
  | "Documentation"
  | "Practice Project";

export type LearningResourceProvider =
  | "Coursera"
  | "Udemy"
  | "edX"
  | "Microsoft Learn"
  | "AWS Skill Builder"
  | "Google Skill Boost"
  | "freeCodeCamp"
  | "MDN"
  | "Codecademy"
  | "Khan Academy"
  | "Cisco Skills for All"
  | "Oracle Learning"
  | "Official Documentation";

export type RoadmapDifficulty = "Beginner" | "Intermediate" | "Advanced";

/**
 * Input shape for a resource before it's persisted — matches
 * LearningResource minus id/phaseId/isCompleted/completedAt, which
 * are assigned at creation/toggle time.
 */
export interface ResourceTemplate {
  title: string;
  type: LearningResourceType;
  provider: LearningResourceProvider;
  url: string;
  estimatedHours: number;
  isOptional: boolean;
  isFree: boolean;
}

/**
 * Input shape for a milestone before it's persisted — matches
 * Milestone minus id/phaseId/isCompleted/completedAt.
 */
export interface MilestoneTemplate {
  title: string;
  description: string;
  order: number;
}

/**
 * Input shape for a phase before it's persisted, with nested
 * resource/milestone templates — matches RoadmapPhase minus
 * id/roadmapId, plus its children.
 */
export interface PhaseTemplate {
  title: string;
  description: string;
  order: number;
  estimatedWeeks: number;
  resources: ResourceTemplate[];
  milestones: MilestoneTemplate[];
}

/**
 * A full roadmap template for a career category, before being
 * parameterized with a specific CareerRecord's name/skills at
 * generation time. See Module 1's architecture note: authored per
 * category (14), instantiated per career (~100) at generation time.
 */
export interface RoadmapTemplate {
  categoryId: string;
  title: string;
  description: string;
  estimatedDuration: string;
  difficulty: RoadmapDifficulty;
  phases: PhaseTemplate[];
}

/** Read-shape used by components — mirrors the Prisma model plus computed fields. */
export interface RoadmapResourceView {
  id: string;
  title: string;
  type: LearningResourceType;
  provider: LearningResourceProvider;
  url: string;
  estimatedHours: number;
  isOptional: boolean;
  isFree: boolean;
  isCompleted: boolean;
}

export interface RoadmapMilestoneView {
  id: string;
  title: string;
  description: string;
  order: number;
  isCompleted: boolean;
}

export interface RoadmapPhaseView {
  id: string;
  title: string;
  description: string;
  order: number;
  estimatedWeeks: number;
  resources: RoadmapResourceView[];
  milestones: RoadmapMilestoneView[];
  /** Derived: true when every resource and milestone in this phase is complete. */
  isComplete: boolean;
  /** Derived: 0-100, weighted equally across resources + milestones. */
  progressPercent: number;
}

export interface RoadmapView {
  id: string;
  recommendationId: string;
  title: string;
  description: string;
  estimatedDuration: string;
  difficulty: RoadmapDifficulty;
  phases: RoadmapPhaseView[];
  /** Derived: 0-100 across all phases. */
  overallProgress: number;
  /** Derived: first phase that isn't fully complete, or the last phase if all are done. */
  currentPhase: RoadmapPhaseView | null;
  /** Derived: first incomplete milestone within currentPhase, if any. */
  nextMilestone: RoadmapMilestoneView | null;
}