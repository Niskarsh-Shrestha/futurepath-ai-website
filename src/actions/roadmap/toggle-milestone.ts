"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

interface ToggleMilestoneResult {
  success: boolean;
  isCompleted?: boolean;
  error?: string;
}

/**
 * Toggles a Milestone's completion state. Same ownership-chain pattern
 * as toggleResource — Milestone -> phase -> roadmap -> recommendation ->
 * analysis -> assessment -> child -> user.
 */
export async function toggleMilestone(milestoneId: string): Promise<ToggleMilestoneResult> {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: "Not authenticated" };
  }

  const milestone = await db.milestone.findUnique({
    where: { id: milestoneId },
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

  const ownerId = milestone?.phase.roadmap.recommendation.analysis.assessment.child.userId;
  if (!milestone || ownerId !== session.user.id) {
    return { success: false, error: "Milestone not found" };
  }

  const nextCompleted = !milestone.isCompleted;

  await db.milestone.update({
    where: { id: milestoneId },
    data: {
      isCompleted: nextCompleted,
      completedAt: nextCompleted ? new Date() : null,
    },
  });

  const recommendationId = milestone.phase.roadmap.recommendationId;
  revalidatePath(`/dashboard/roadmap/${recommendationId}`);
  revalidatePath("/dashboard/roadmap");
  revalidatePath("/dashboard");

  return { success: true, isCompleted: nextCompleted };
}