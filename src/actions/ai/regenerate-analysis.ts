"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { generateAiAnalysis } from "@/lib/ai/client";
import { buildAiAnalysisUserPrompt } from "@/lib/ai/prompts";
import { ASSESSMENT_SECTIONS } from "@/lib/assessment/sections";
import { getQuestionById } from "@/lib/assessment/assessment-engine";

interface RegenerateAnalysisResult {
  success: boolean;
  analysisId?: string;
  error?: string;
}

function calculateAge(dateOfBirth: Date): number {
  const today = new Date();
  let age = today.getFullYear() - dateOfBirth.getFullYear();
  const monthDiff = today.getMonth() - dateOfBirth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dateOfBirth.getDate())) age--;
  return age;
}

function formatAnswerForPrompt(value: unknown): string {
  if (value === null || value === undefined || value === "") return "Not answered";
  if (Array.isArray(value)) return value.length > 0 ? value.join(", ") : "Not answered";
  return String(value);
}

/**
 * Explicit manual override: deletes any existing analysis for this
 * assessment and generates a fresh one. This is the ONLY path that
 * replaces an existing analysis — generateAnalysis() never does this
 * automatically.
 */
export async function regenerateAnalysis(assessmentId: string): Promise<RegenerateAnalysisResult> {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: "Not authenticated" };
  }

  const assessment = await db.assessment.findUnique({
    where: { id: assessmentId },
    include: { child: true, answers: true, aiAnalysis: true },
  });

  if (!assessment || assessment.child.userId !== session.user.id) {
    return { success: false, error: "Assessment not found" };
  }

  if (assessment.status !== "SUBMITTED") {
    return { success: false, error: "This assessment must be submitted before it can be analyzed" };
  }

  const answersBySection: Record<string, { questionLabel: string; answer: string }[]> = {};

  for (const section of ASSESSMENT_SECTIONS) {
    const sectionAnswers = assessment.answers.filter((a) => {
      const question = getQuestionById(a.questionId);
      return question?.sectionId === section.id;
    });

    if (sectionAnswers.length === 0) continue;

    answersBySection[section.title] = sectionAnswers
      .map((a) => {
        const question = getQuestionById(a.questionId);
        if (!question) return null;
        return { questionLabel: question.label, answer: formatAnswerForPrompt(a.answer) };
      })
      .filter((x): x is { questionLabel: string; answer: string } => x !== null);
  }

  const childAge = calculateAge(assessment.child.dateOfBirth);
  const userPrompt = buildAiAnalysisUserPrompt(assessment.child.firstName, childAge, answersBySection);

  const aiResult = await generateAiAnalysis(userPrompt);

  if (!aiResult.success || !aiResult.data) {
    return { success: false, error: aiResult.error ?? "Failed to regenerate analysis" };
  }

  const { data, model, promptVersion } = aiResult;

  // Delete existing analysis (cascades to CareerMatch rows via onDelete: Cascade)
  // before creating the new one — the @unique constraint on assessmentId
  // would otherwise reject the create.
  if (assessment.aiAnalysis) {
    await db.aIAnalysis.delete({ where: { id: assessment.aiAnalysis.id } });
  }

  const created = await db.aIAnalysis.create({
    data: {
      assessmentId: assessment.id,
      summary: data.summary,
      strengths: data.strengths,
      weaknesses: data.weaknesses,
      learningStyleAnalysis: data.learningStyleAnalysis,
      personalityAnalysis: data.personalityAnalysis,
      careerInterestAnalysis: data.careerInterestAnalysis,
      confidenceScore: data.confidenceScore,
      model: model as string,
      promptVersion: promptVersion as string,
      careerMatches: {
        create: data.careerMatches.map((m) => ({
          career: m.career,
          score: m.score,
          reason: m.reason,
        })),
      },
    },
  });

  revalidatePath(`/dashboard/results/${assessmentId}`);
  revalidatePath("/dashboard");

  return { success: true, analysisId: created.id };
}