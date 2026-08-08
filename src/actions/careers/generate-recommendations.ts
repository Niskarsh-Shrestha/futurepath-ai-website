"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { getTopCareerMatches, type AnalysisSignals } from "@/lib/careers/career-engine";
import {
  getDifficulty,
  buildReasoning,
  buildCareerPath,
  buildSkillGaps,
  formatSalaryRange,
} from "@/lib/careers/recommendation-builder";

interface GenerateRecommendationsResult {
  success: boolean;
  recommendationIds?: string[];
  error?: string;
}

/**
 * Generates (or returns existing, cached) career recommendations for a
 * given AI analysis. Never regenerates automatically if recommendations
 * already exist for this analysis — mirrors the caching behavior from
 * Task 8's generateAnalysis().
 */
export async function generateRecommendations(analysisId: string): Promise<GenerateRecommendationsResult> {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: "Not authenticated" };
  }

  const analysis = await db.aIAnalysis.findUnique({
    where: { id: analysisId },
    include: {
      assessment: { include: { child: true } },
      careerMatches: true,
      recommendations: true,
    },
  });

  if (!analysis || analysis.assessment.child.userId !== session.user.id) {
    return { success: false, error: "Analysis not found" };
  }

  if (analysis.recommendations.length > 0) {
    return { success: true, recommendationIds: analysis.recommendations.map((r) => r.id) };
  }

  const signals: AnalysisSignals = {
    strengths: analysis.strengths,
    weaknesses: analysis.weaknesses,
    personalityAnalysis: analysis.personalityAnalysis,
    learningStyleAnalysis: analysis.learningStyleAnalysis,
    careerInterestAnalysis: analysis.careerInterestAnalysis,
    aiCareerMatches: analysis.careerMatches.map((m) => ({ career: m.career, score: m.score })),
  };

  const topMatches = getTopCareerMatches(signals, 5);
  const childName = analysis.assessment.child.firstName;

  const recommendationIds: string[] = [];

  for (const { career, score, matchedSignals } of topMatches) {
    const created = await db.careerRecommendation.create({
      data: {
        analysisId: analysis.id,
        careerTitle: career.name,
        careerCategory: career.category,
        matchScore: score,
        salaryRange: formatSalaryRange(career.averageSalary),
        educationLevel: career.requiredDegree,
        description: career.description,
        futureDemand: career.futureDemand,
        difficulty: getDifficulty(career),
        reasoning: buildReasoning(career, matchedSignals, childName),
        careerPath: {
          create: buildCareerPath(career),
        },
        skillGaps: {
          create: buildSkillGaps(career, analysis.strengths),
        },
      },
    });

    recommendationIds.push(created.id);
  }

  revalidatePath("/dashboard/careers");
  revalidatePath(`/dashboard/results/${analysis.assessmentId}`);
  revalidatePath("/dashboard");

  return { success: true, recommendationIds };
}