"use server";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import type {
  Plan,
  SubscriptionStatus,
} from "@prisma/client";

export interface SubscriptionView {
  id: string;
  plan: Plan;
  status: SubscriptionStatus;
  startedAt: Date;
  expiresAt: Date | null;
  history: {
    id: string;
    plan: Plan;
    amount: number;
    status: string;
    createdAt: Date;
  }[];
}

interface GetSubscriptionResult {
  success: boolean;
  subscription: SubscriptionView | null;
  error?: string;
}

export async function getSubscription(): Promise<GetSubscriptionResult> {
  const session = await auth();

  const userId = session?.user?.id;

  if (!userId) {
    return {
      success: false,
      subscription: null,
      error: "Not authenticated",
    };
  }

  const subscription = await db.subscription.findUnique({
    where: {
      userId,
    },
    include: {
      history: {
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

  if (!subscription) {
    return {
      success: true,
      subscription: null,
    };
  }

  const subscriptionView: SubscriptionView = {
    id: subscription.id,
    plan: subscription.plan,
    status: subscription.status,
    startedAt: subscription.startedAt,
    expiresAt: subscription.expiresAt,
    history: subscription.history.map((entry) => ({
      id: entry.id,
      plan: entry.plan,
      amount: Number(entry.amount),
      status: entry.status,
      createdAt: entry.createdAt,
    })),
  };

  return {
    success: true,
    subscription: subscriptionView,
  };
}