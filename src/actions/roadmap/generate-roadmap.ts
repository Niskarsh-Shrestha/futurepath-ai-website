"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { getCareerById } from "@/lib/careers/career-data";
import { buildRoadmapForCareer } from "@/lib/roadmap/roadmap-builder";

interface GenerateRoadmapResult {
  success: boolean;
  roadmapId?: string;
  error?: string;
}

/**
 * Generates (or returns existing, cached) a LearningRoadmap for a given
 * CareerRecommendation. Never regenerates automatically if a roadmap
 * already exists — same caching pattern as generateAnalysis (Task 8)
 * and generateRecommendations (Task 9).
 */
export async function generateRoadmap(recommendationId: string): Promise<GenerateRoadmapResult> {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: "Not authenticated" };
  }

  const recommendation = await db.careerRecommendation.findUnique({
    where: { id: recommendationId },
    include: {
      analysis: { include: { assessment: { include: { child: true } } } },
      roadmap: true,
    },
  });

  if (!recommendation || recommendation.analysis.assessment.child.userId !== session.user.id) {
    return { success: false, error: "Career recommendation not found" };
  }

  if (recommendation.roadmap) {
    return { success: true, roadmapId: recommendation.roadmap.id };
  }

  // Recommendation stores careerTitle/careerCategory directly, but the
  // richer static CareerRecord (skills, etc.) is looked up by slugified
  // title — same best-effort pattern already used in compare-careers.ts
  // and the career details page (Task 9), with the same known fragility.
  const staticRecord = getCareerById(
    recommendation.careerTitle.toLowerCase().replace(/[^a-z0-9]+/g, "-")
  );

  if (!staticRecord) {
    return { success: false, error: "Could not find career data to build a roadmap" };
  }

  const built = buildRoadmapForCareer(staticRecord);
  if (!built) {
    return { success: false, error: "No roadmap template available for this career category" };
  }

  const roadmap = await db.learningRoadmap.create({
    data: {
      recommendationId: recommendation.id,
      title: built.title,
      description: built.description,
      estimatedDuration: built.estimatedDuration,
      difficulty: built.difficulty,
      phases: {
        create: built.phases.map((phase) => ({
          title: phase.title,
          description: phase.description,
          order: phase.order,
          estimatedWeeks: phase.estimatedWeeks,
          resources: { create: phase.resources },
          milestones: { create: phase.milestones },
        })),
      },
    },
  });

  revalidatePath("/dashboard/roadmap");
  revalidatePath(`/dashboard/roadmap/${recommendation.id}`);
  revalidatePath("/dashboard");

  return { success: true, roadmapId: roadmap.id };
}