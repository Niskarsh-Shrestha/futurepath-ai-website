"use client";

import { CalendarDays, CreditCard } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Typography } from "@/components/ui/typography";

interface CurrentPlanCardProps {
  plan: string;
  status: string;
  startedAt: Date;
  expiresAt: Date | null;
}

const PLAN_LABELS: Record<string, string> = {
  FREE: "Free",
  BASIC: "Basic",
  PREMIUM: "Premium",
  PRO: "Pro",
};

function formatDate(date: Date | null): string {
  if (!date) return "No expiration";

  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function getPlanLabel(plan: string): string {
  return PLAN_LABELS[plan] ?? plan;
}

function getStatusVariant(
  status: string
): "subtle" | "outline" {
  return status.toUpperCase() === "ACTIVE" ? "subtle" : "outline";
}

export function CurrentPlanCard({
  plan,
  status,
  startedAt,
  expiresAt,
}: CurrentPlanCardProps) {
  return (
    <Card className="rounded-2xl border border-border bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10">
            <CreditCard
              className="h-5 w-5 text-primary"
              aria-hidden="true"
            />
          </div>

          <div>
            <Typography
              variant="caption"
              className="text-muted-foreground"
            >
              Current Plan
            </Typography>

            <Typography
              variant="title"
              as="h2"
              className="mt-1 font-semibold text-foreground"
            >
              {getPlanLabel(plan)}
            </Typography>

            <div className="mt-2">
              <Badge
                variant={getStatusVariant(status)}
                size="sm"
              >
                {status}
              </Badge>
            </div>
          </div>
        </div>

        <div className="rounded-lg bg-muted/50 px-4 py-3">
          <Typography
            variant="caption"
            className="text-muted-foreground"
          >
            Plan Status
          </Typography>

          <Typography
            variant="bodySmall"
            className="mt-1 font-medium text-foreground"
          >
            {status.toUpperCase() === "ACTIVE"
              ? "Your plan is active"
              : "Your plan is not active"}
          </Typography>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 border-t border-border pt-6 sm:grid-cols-2">
        <div className="flex items-start gap-3">
          <CalendarDays
            className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground"
            aria-hidden="true"
          />

          <div>
            <Typography
              variant="caption"
              className="text-muted-foreground"
            >
              Started
            </Typography>

            <Typography
              variant="bodySmall"
              className="mt-0.5 font-medium text-foreground"
            >
              {formatDate(startedAt)}
            </Typography>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <CalendarDays
            className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground"
            aria-hidden="true"
          />

          <div>
            <Typography
              variant="caption"
              className="text-muted-foreground"
            >
              Expires
            </Typography>

            <Typography
              variant="bodySmall"
              className="mt-0.5 font-medium text-foreground"
            >
              {formatDate(expiresAt)}
            </Typography>
          </div>
        </div>
      </div>
    </Card>
  );
}