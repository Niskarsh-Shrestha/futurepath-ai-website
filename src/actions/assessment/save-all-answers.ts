"use server";

import { Prisma } from "@prisma/client";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { ASSESSMENT_QUESTIONS } from "@/lib/assessment/questions";
import { validateAnswerForType } from "@/lib/validations/assessment";
import { calculateProgress } from "@/lib/assessment/assessment-engine";
import type { AnswerValue } from "@/components/assessment/question-card";

interface SaveAllAnswersInput {
  assessmentId: string;
  answers: Record<string, AnswerValue>;
}

interface SaveAllAnswersResult {
  success: boolean;
  error?: string;
}

export async function saveAllAnswers({
  assessmentId,
  answers,
}: SaveAllAnswersInput): Promise<SaveAllAnswersResult> {
  const session = await auth();

  if (!session?.user?.id) {
    return {
      success: false,
      error: "Not authenticated",
    };
  }

  const assessment = await db.assessment.findUnique({
    where: { id: assessmentId },
    include: { child: true },
  });

  if (!assessment || assessment.child.userId !== session.user.id) {
    return {
      success: false,
      error: "Assessment not found",
    };
  }

  if (assessment.status === "SUBMITTED") {
    return {
      success: false,
      error: "This assessment has already been submitted",
    };
  }

  // Validate all answers before writing anything to the database.
  for (const question of ASSESSMENT_QUESTIONS) {
    const answer = answers[question.id] ?? null;

    const validationError = validateAnswerForType(
      question.type,
      answer,
      question.required
    );

    if (validationError && answer !== null) {
      return {
        success: false,
        error: `${question.id}: ${validationError}`,
      };
    }
  }

  const answeredIds = new Set(
    Object.entries(answers)
      .filter(
        ([, value]) =>
          value !== null &&
          value !== "" &&
          !(Array.isArray(value) && value.length === 0)
      )
      .map(([questionId]) => questionId)
  );

  const progress = calculateProgress(answeredIds);

  // Save all answers in one database transaction.
  const answerRows = ASSESSMENT_QUESTIONS
  .filter((question) => {
    const answer = answers[question.id];

    return (
      answer !== undefined &&
      answer !== null &&
      answer !== "" &&
      !(Array.isArray(answer) && answer.length === 0)
    );
  })
  .map((question) => ({
    assessmentId,
    questionId: question.id,
    answer: answers[question.id] as Prisma.InputJsonValue,
  }));

await db.assessmentAnswer.createMany({
  data: answerRows,
  skipDuplicates: true,
});

await db.assessment.update({
  where: {
    id: assessmentId,
  },
  data: {
    progress,
    status: progress === 100 ? "COMPLETED" : "IN_PROGRESS",
  },
});

  return {
    success: true,
  };
}