"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { ASSESSMENT_QUESTIONS } from "@/lib/assessment/questions";

interface SubmitAssessmentResult {
  success: boolean;
  error?: string;
  missingRequired?: string[];
}

export async function submitAssessment(assessmentId: string): Promise<SubmitAssessmentResult> {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: "Not authenticated" };
  }

  const assessment = await db.assessment.findUnique({
    where: { id: assessmentId },
    include: { child: true, answers: true },
  });

  if (!assessment || assessment.child.userId !== session.user.id) {
    return { success: false, error: "Assessment not found" };
  }

  if (assessment.status === "SUBMITTED") {
    return { success: false, error: "This assessment has already been submitted" };
  }

  const answeredIds = new Set(assessment.answers.map((a) => a.questionId));
  const requiredQuestions = ASSESSMENT_QUESTIONS.filter((q) => q.required);
  const missing = requiredQuestions.filter((q) => !answeredIds.has(q.id));

  if (missing.length > 0) {
    return {
      success: false,
      error: `${missing.length} required question(s) still need an answer`,
      missingRequired: missing.map((q) => q.id),
    };
  }

  await db.assessment.update({
    where: { id: assessmentId },
    data: { status: "SUBMITTED", progress: 100, completedAt: new Date() },
  });

  revalidatePath("/dashboard/assessment");
  revalidatePath(`/dashboard/assessment/${assessmentId}`);

  return { success: true };
}