import { db } from "@/lib/db";
import type { CareerRecommendation, AIAnalysis } from "@prisma/client";

export interface LatestRecommendationsResult {
  analysis: (AIAnalysis & { recommendations: CareerRecommendation[] }) | null;
}

/**
 * Shared by /dashboard/careers and /dashboard/careers/compare — both
 * need "this child's most recent AIAnalysis and its recommendations."
 * See Module 5's design note: latest = most recently created AIAnalysis
 * from a SUBMITTED assessment.
 */
export async function getLatestRecommendations(childId: string): Promise<LatestRecommendationsResult> {
  const analysis = await db.aIAnalysis.findFirst({
    where: { assessment: { childId, status: "SUBMITTED" } },
    include: { recommendations: true },
    orderBy: { createdAt: "desc" },
  });

  return { analysis };
}