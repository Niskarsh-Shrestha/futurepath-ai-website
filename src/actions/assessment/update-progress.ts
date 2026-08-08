"use server";

import { db } from "@/lib/db";
import { calculateProgress } from "@/lib/assessment/assessment-engine";

/**
 * Recalculates and persists an assessment's progress percentage based on
 * currently-saved answers. Called internally after every answer save —
 * not typically invoked directly by the UI.
 */
export async function updateAssessmentProgress(assessmentId: string): Promise<number> {
  const answers = await db.assessmentAnswer.findMany({
    where: { assessmentId },
    select: { questionId: true },
  });

  const answeredIds = new Set(answers.map((a) => a.questionId));
  const progress = calculateProgress(answeredIds);

  await db.assessment.update({
    where: { id: assessmentId },
    data: {
      progress,
      status: progress === 100 ? "COMPLETED" : "IN_PROGRESS",
    },
  });

  return progress;
}