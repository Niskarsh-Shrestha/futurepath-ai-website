"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import type { Plan } from "@prisma/client";

interface ChangePlanResult {
  success: boolean;
  error?: string;
}

/**
 * Static local price table — no payment gateway exists in this phase,
 * so this is the single source of truth for what gets recorded in
 * BillingHistory.amount. See Module 2's design note.
 */
const PLAN_PRICES: Record<Plan, number> = {
  FREE: 0,
  PREMIUM_MONTHLY: 9.99,
  PREMIUM_ANNUAL: 89.99,
};

/**
 * Creates a subscription if the user doesn't have one, or updates the
 * existing one otherwise. Covers both "upgrade" and "downgrade" — this
 * module intentionally doesn't distinguish direction; any change from
 * the current plan to a different one is handled identically. Every
 * successful change is recorded in BillingHistory. Switching to the
 * plan the user is already on is a no-op (not an error, not a new
 * history row) to avoid meaningless duplicate billing entries.
 */
export async function changePlan(newPlan: Plan): Promise<ChangePlanResult> {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: "Not authenticated" };
  }

  const existing = await db.subscription.findUnique({ where: { userId: session.user.id } });

  if (existing && existing.plan === newPlan && existing.status === "ACTIVE") {
    return { success: true }; // already on this plan — nothing to do
  }

  const amount = PLAN_PRICES[newPlan];
  const expiresAt =
    newPlan === "PREMIUM_MONTHLY"
      ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      : newPlan === "PREMIUM_ANNUAL"
        ? new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
        : null;

  const subscription = existing
    ? await db.subscription.update({
        where: { userId: session.user.id },
        data: { plan: newPlan, status: "ACTIVE", expiresAt },
      })
    : await db.subscription.create({
        data: { userId: session.user.id, plan: newPlan, status: "ACTIVE", expiresAt },
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

  return { success: true };
}