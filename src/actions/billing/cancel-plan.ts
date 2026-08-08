"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import type { Plan } from "@prisma/client";

interface ChangePlanResult {
  success: boolean;
  error?: string;
}

const PLAN_PRICES: Record<Plan, number> = {
  FREE: 0,
  PREMIUM_MONTHLY: 9.99,
  PREMIUM_ANNUAL: 89.99,
};

export async function changePlan(
  newPlan: Plan
): Promise<ChangePlanResult> {
  const session = await auth();

  const userId = session?.user?.id;

  if (!userId) {
    return {
      success: false,
      error: "Not authenticated",
    };
  }

  const existing = await db.subscription.findUnique({
    where: {
      userId,
    },
  });

  if (
    existing &&
    existing.plan === newPlan &&
    existing.status === "ACTIVE"
  ) {
    return {
      success: true,
    };
  }

  const amount = PLAN_PRICES[newPlan];

  let expiresAt: Date | null = null;

  if (newPlan === "PREMIUM_MONTHLY") {
    expiresAt = new Date(
      Date.now() + 30 * 24 * 60 * 60 * 1000
    );
  } else if (newPlan === "PREMIUM_ANNUAL") {
    expiresAt = new Date(
      Date.now() + 365 * 24 * 60 * 60 * 1000
    );
  }

  const subscription = existing
    ? await db.subscription.update({
        where: {
          userId,
        },
        data: {
          plan: newPlan,
          status: "ACTIVE",
          expiresAt,
        },
      })
    : await db.subscription.create({
        data: {
          userId,
          plan: newPlan,
          status: "ACTIVE",
          expiresAt,
        },
      });

  await db.billingHistory.create({
    data: {
      subscriptionId: subscription.id,
      plan: newPlan,
      amount,
      status: "PAID",
    },
  });

  revalidatePath("/dashboard/billing");

  return {
    success: true,
  };
}