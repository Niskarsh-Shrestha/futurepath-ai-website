"use client";

import { useTransition } from "react";
import { Check } from "lucide-react";
import { changePlan } from "@/actions/billing/change-plan";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Typography } from "@/components/ui/typography";
import { useToast } from "@/components/ui/toast";
import { cn } from "@/lib/utils";
import type { Plan } from "@prisma/client";

interface PlanCardProps {
  plan: Plan;
  title: string;
  price: string;
  cadence: string;
  features: string[];
  tier: number;
  currentTier: number;
  isCurrent: boolean;
  highlighted?: boolean;
}

export function PlanCard({
  plan,
  title,
  price,
  cadence,
  features,
  tier,
  currentTier,
  isCurrent,
  highlighted = false,
}: PlanCardProps) {
  const { showToast } = useToast();
  const [isPending, startTransition] = useTransition();

  function handleSelect() {
    if (isCurrent || isPending) {
      return;
    }

    startTransition(async () => {
      const result = await changePlan(plan);

      if (!result.success) {
        showToast(
          result.error ?? "Failed to change plan",
          "error"
        );
        return;
      }

      showToast(`Switched to ${title}`);
    });
  }

  const actionLabel = isCurrent
    ? "Current Plan"
    : tier > currentTier
      ? "Upgrade"
      : "Downgrade";

  return (
    <Card
      className={cn(
        "flex h-full flex-col rounded-2xl border bg-white p-6 shadow-sm",
        highlighted
          ? "border-primary ring-1 ring-primary"
          : "border-border"
      )}
    >
      <div className="flex items-center justify-between gap-3">
        <Typography
          variant="title"
          as="h3"
          className="font-semibold text-foreground"
        >
          {title}
        </Typography>

        {highlighted && (
          <Badge variant="primary" size="sm">
            Popular
          </Badge>
        )}
      </div>

      <div className="mt-3">
        <span className="text-3xl font-bold text-foreground">
          {price}
        </span>

        <span className="ml-1 text-sm text-muted-foreground">
          {cadence}
        </span>
      </div>

      <ul className="mt-5 flex-1 space-y-2.5">
        {features.map((feature) => (
          <li
            key={feature}
            className="flex gap-2"
          >
            <Check
              className="mt-0.5 h-4 w-4 shrink-0 text-success"
              aria-hidden="true"
            />

            <Typography
              variant="bodySmall"
              className="text-muted-foreground"
            >
              {feature}
            </Typography>
          </li>
        ))}
      </ul>

      <Button
        variant={isCurrent ? "outline" : "primary"}
        size="md"
        className="mt-6 w-full"
        disabled={isCurrent || isPending}
        loading={isPending}
        onClick={handleSelect}
      >
        {actionLabel}
      </Button>
    </Card>
  );
}