"use server";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { getCareerById } from "@/lib/careers/career-data";

export interface CareerComparisonSide {
  id: string;
  careerTitle: string;
  careerCategory: string;
  matchScore: number;
  salaryRange: string;
  educationLevel: string;
  difficulty: string;
  futureDemand: string;
  automationRisk: string;
  workEnvironment: string;
  growthRate: number;
}

interface CompareCareersResult {
  success: boolean;
  careerA?: CareerComparisonSide;
  careerB?: CareerComparisonSide;
  error?: string;
}

async function loadComparisonSide(
  recommendationId: string,
  userId: string
): Promise<CareerComparisonSide | null> {
  const recommendation = await db.careerRecommendation.findUnique({
    where: { id: recommendationId },
    include: { analysis: { include: { assessment: { include: { child: true } } } } },
  });

  if (!recommendation || recommendation.analysis.assessment.child.userId !== userId) {
    return null;
  }

  // Supplementary fields (automation risk, work environment, growth rate)
  // aren't stored on CareerRecommendation per the spec's field list —
  // pulled from the static dataset by matching the stored career title.
  const staticRecord = getCareerById(
    recommendation.careerTitle.toLowerCase().replace(/[^a-z0-9]+/g, "-")
  );

  return {
    id: recommendation.id,
    careerTitle: recommendation.careerTitle,
    careerCategory: recommendation.careerCategory,
    matchScore: recommendation.matchScore,
    salaryRange: recommendation.salaryRange,
    educationLevel: recommendation.educationLevel,
    difficulty: recommendation.difficulty,
    futureDemand: recommendation.futureDemand,
    automationRisk: staticRecord?.automationRisk ?? "Moderate",
    workEnvironment: staticRecord?.workEnvironment ?? "Varies",
    growthRate: staticRecord?.growthRate ?? 0,
  };
}

export async function compareCareers(
  recommendationIdA: string,
  recommendationIdB: string
): Promise<CompareCareersResult> {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: "Not authenticated" };
  }

  const [careerA, careerB] = await Promise.all([
    loadComparisonSide(recommendationIdA, session.user.id),
    loadComparisonSide(recommendationIdB, session.user.id),
  ]);

  if (!careerA || !careerB) {
    return { success: false, error: "One or both careers could not be found" };
  }

  return { success: true, careerA, careerB };
}