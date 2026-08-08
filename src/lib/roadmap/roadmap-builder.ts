import type { CareerRecord } from "@/lib/careers/career-data";
import { getRoadmapTemplate } from "@/lib/roadmap/roadmap-data";
import { CAREER_TOKEN, skillResource } from "@/lib/roadmap/resource-library";
import type {
  ResourceTemplate,
  MilestoneTemplate,
  RoadmapDifficulty,
} from "@/lib/roadmap/roadmap-types";

function replaceToken(text: string, careerTitle: string): string {
  return text.split(CAREER_TOKEN).join(careerTitle);
}

export type BuiltResource = ResourceTemplate;
export type BuiltMilestone = MilestoneTemplate;
export interface BuiltPhase {
  title: string;
  description: string;
  order: number;
  estimatedWeeks: number;
  resources: BuiltResource[];
  milestones: BuiltMilestone[];
}
export interface BuiltRoadmap {
  title: string;
  description: string;
  estimatedDuration: string;
  difficulty: RoadmapDifficulty;
  phases: BuiltPhase[];
}

/**
 * Instantiates the category-level RoadmapTemplate for a specific career:
 * replaces every {{CAREER}} token with the real career title, and injects
 * 1-2 skill-specific resources (pulled from the static CareerRecord) into
 * the first core-skill phase — the layer of parameterization that keeps
 * category templates from reading as generic. See Module 2's design note.
 *
 * Returns null if no template exists for the career's category (should
 * not happen given all 14 categories are covered, but the caller must
 * handle it rather than assume).
 */
export function buildRoadmapForCareer(career: CareerRecord): BuiltRoadmap | null {
  const template = getRoadmapTemplate(career.category);
  if (!template) return null;

  const phases: BuiltPhase[] = template.phases.map((phase, index) => {
    const builtPhase: BuiltPhase = {
      title: replaceToken(phase.title, career.name),
      description: replaceToken(phase.description, career.name),
      order: phase.order,
      estimatedWeeks: phase.estimatedWeeks,
      resources: phase.resources.map((r) => ({
        ...r,
        title: replaceToken(r.title, career.name),
      })),
      milestones: phase.milestones.map((m) => ({
        ...m,
        title: replaceToken(m.title, career.name),
        description: replaceToken(m.description, career.name),
      })),
    };

    // Inject skill-specific resources into the first phase after
    // Foundation (order 2) — the first "core skill" phase in every
    // template — using the career's real skills from the static dataset.
    if (index === 1 && career.skills.length > 0) {
      const injected = career.skills.slice(0, 2).map((skill) => skillResource(skill));
      builtPhase.resources = [...builtPhase.resources, ...injected];
    }

    return builtPhase;
  });

  return {
    title: replaceToken(template.title, career.name),
    description: replaceToken(template.description, career.name),
    estimatedDuration: template.estimatedDuration,
    difficulty: template.difficulty,
    phases,
  };
}