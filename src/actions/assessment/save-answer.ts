"use server";

import { Prisma } from "@prisma/client";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { saveAnswerSchema } from "@/lib/validations/assessment";
import { getQuestionById } from "@/lib/assessment/assessment-engine";
import { validateAnswerForType } from "@/lib/validations/assessment";
import { updateAssessmentProgress } from "@/actions/assessment/update-progress";

interface SaveAnswerResult {
  success: boolean;
  error?: string;
}

async function assertOwnsAssessment(
  assessmentId: string,
  userId: string,
) {
  const assessment = await db.assessment.findUnique({
    where: { id: assessmentId },
    include: { child: true },
  });

  if (!assessment || assessment.child.userId !== userId) {
    return null;
  }

  return assessment;
}

export async function saveAnswer(
  formData: unknown,
): Promise<SaveAnswerResult> {
  const session = await auth();

  if (!session?.user?.id) {
    return {
      success: false,
      error: "Not authenticated",
    };
  }

  const parsed = saveAnswerSchema.safeParse(formData);

  if (!parsed.success) {
    return {
      success: false,
      error: "Invalid answer data",
    };
  }

  const {
    assessmentId,
    questionId,
    answer,
    notes,
  } = parsed.data;

  const assessment = await assertOwnsAssessment(
    assessmentId,
    session.user.id,
  );

  if (!assessment) {
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

  const question = getQuestionById(questionId);

  if (!question) {
    return {
      success: false,
      error: "Unknown question",
    };
  }

  const validationError = validateAnswerForType(
    question.type,
    answer,
    question.required,
  );

  if (validationError && answer !== null) {
    return {
      success: false,
      error: validationError,
    };
  }

  await db.assessmentAnswer.upsert({
    where: {
      assessmentId_questionId: {
        assessmentId,
        questionId,
      },
    },

    create: {
      assessmentId,
      questionId,
      answer: answer ?? Prisma.JsonNull,
      notes,
    },

    update: {
      answer: answer ?? Prisma.JsonNull,
      notes,
    },
  });

  if (assessment.status === "DRAFT") {
    await db.assessment.update({
      where: {
        id: assessmentId,
      },
      data: {
        status: "IN_PROGRESS",
      },
    });
  }

  await updateAssessmentProgress(assessmentId);

  return {
    success: true,
  };
}