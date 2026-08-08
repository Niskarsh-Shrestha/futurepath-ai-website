"use server";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

interface CreateAssessmentResult {
  success: boolean;
  assessmentId?: string;
  error?: string;
}

/**
 * Returns the existing in-progress/draft assessment for a child if one
 * exists, otherwise creates a new one. This is what "Start Assessment"
 * and "Resume Later" both call — the same action naturally supports both.
 */
export async function createOrResumeAssessment(childId: string): Promise<CreateAssessmentResult> {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: "Not authenticated" };
  }

  const child = await db.child.findUnique({ where: { id: childId } });
  if (!child || child.userId !== session.user.id) {
    return { success: false, error: "Child not found" };
  }

const existing = await db.assessment.findFirst({
  where: { childId },
  orderBy: { createdAt: "desc" },
});

  if (existing) {
    return { success: true, assessmentId: existing.id };
  }

  const assessment = await db.assessment.create({
    data: { childId, status: "DRAFT", progress: 0 },
  });

  return { success: true, assessmentId: assessment.id };
}