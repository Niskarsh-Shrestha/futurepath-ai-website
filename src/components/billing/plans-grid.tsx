import { PlanCard } from "@/components/billing/plan-card";
import type { Plan } from "@prisma/client";

const PLAN_TIER: Record<Plan, number> = {
  FREE: 0,
  PREMIUM_MONTHLY: 1,
  PREMIUM_ANNUAL: 2,
};

interface PlansGridProps {
  currentPlan: Plan;
}

export function PlansGrid({
  currentPlan,
}: PlansGridProps) {
  const currentTier = PLAN_TIER[currentPlan];

  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
      <PlanCard
        plan="FREE"
        title="Free"
        price="$0"
        cadence="/ forever"
        features={[
          "1 child profile",
          "Basic assessment",
          "Limited career matches",
        ]}
        tier={PLAN_TIER.FREE}
        currentTier={currentTier}
        isCurrent={currentPlan === "FREE"}
      />

      <PlanCard
        plan="PREMIUM_MONTHLY"
        title="Premium Monthly"
        price="$9.99"
        cadence="/ month"
        features={[
          "Unlimited children",
          "Full AI analysis",
          "Learning roadmaps",
          "Downloadable reports",
        ]}
        tier={PLAN_TIER.PREMIUM_MONTHLY}
        currentTier={currentTier}
        isCurrent={currentPlan === "PREMIUM_MONTHLY"}
        highlighted
      />

      <PlanCard
        plan="PREMIUM_ANNUAL"
        title="Premium Annual"
        price="$89.99"
        cadence="/ year"
        features={[
          "Everything in Monthly",
          "2 months free",
          "Priority support",
        ]}
        tier={PLAN_TIER.PREMIUM_ANNUAL}
        currentTier={currentTier}
        isCurrent={currentPlan === "PREMIUM_ANNUAL"}
      />
    </div>
  );
}