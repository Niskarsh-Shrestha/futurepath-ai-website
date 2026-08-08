"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

interface ToggleResourceResult {
  success: boolean;
  isCompleted?: boolean;
  error?: string;
}

/**
 * Toggles a LearningResource's completion state. Ownership is verified by
 * walking the full relation chain up to the owning User — the same
 * pattern used for CareerRecommendation/roadmap ownership checks in
 * Modules 2-3, extended one level deeper to LearningResource -> phase.
 */
export async function toggleResource(resourceId: string): Promise<ToggleResourceResult> {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: "Not authenticated" };
  }

  const resource = await db.learningResource.findUnique({
    where: { id: resourceId },
    include: {
      phase: {
        include: {
          roadmap: {
            include: {
              recommendation: {
                include: {
                  analysis: {
                    include: {
                      assessment: { include: { child: true } },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  });

  const ownerId = resource?.phase.roadmap.recommendation.analysis.assessment.child.userId;
  if (!resource || ownerId !== session.user.id) {
    return { success: false, error: "Resource not found" };
  }

  const nextCompleted = !resource.isCompleted;

  await db.learningResource.update({
    where: { id: resourceId },
    data: {
      isCompleted: nextCompleted,
      completedAt: nextCompleted ? new Date() : null,
    },
  });

  const recommendationId = resource.phase.roadmap.recommendationId;
  revalidatePath(`/dashboard/roadmap/${recommendationId}`);
  revalidatePath("/dashboard/roadmap");
  revalidatePath("/dashboard");

  return { success: true, isCompleted: nextCompleted };
}