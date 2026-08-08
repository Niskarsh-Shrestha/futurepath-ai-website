"use client";

import { motion } from "framer-motion";
import {
  TrendingUp,
  TrendingDown,
  Minus,
  type LucideIcon,
} from "lucide-react";

import { Card } from "@/components/ui/card";
import { Typography } from "@/components/ui/typography";

type TrendDirection = "up" | "down" | "flat";

export interface StatCardData {
  icon: LucideIcon;
  value: string | number;
  label: string;
  trend: {
    direction: TrendDirection;
    label: string;
  };
}

interface StatCardProps {
  data: StatCardData;
  index: number;
}

const TREND_CONFIG: Record<
  TrendDirection,
  {
    icon: LucideIcon;
    className: string;
  }
> = {
  up: {
    icon: TrendingUp,
    className: "text-success",
  },
  down: {
    icon: TrendingDown,
    className: "text-destructive",
  },
  flat: {
    icon: Minus,
    className: "text-muted-foreground",
  },
};

export function StatCard({ data, index }: StatCardProps) {
  const trend = TREND_CONFIG[data.trend.direction];
  const TrendIcon = trend.icon;
  const StatIcon = data.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.4,
        delay: index * 0.08,
      }}
    >
      <Card className="rounded-2xl border border-border bg-white p-5 shadow-sm">
        <div className="flex items-start justify-between">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
            <StatIcon
              className="h-5 w-5 text-primary"
              aria-hidden="true"
            />
          </span>

          <span
            className={`flex items-center gap-1 text-xs font-medium ${trend.className}`}
          >
            <TrendIcon
              className="h-3.5 w-3.5"
              aria-hidden="true"
            />
            {data.trend.label}
          </span>
        </div>

        <div className="mt-4">
          <Typography
            variant="title"
            as="p"
            className="font-semibold text-foreground"
          >
            {data.value}
          </Typography>

          <Typography
            variant="caption"
            className="mt-1 block text-muted-foreground"
          >
            {data.label}
          </Typography>
        </div>
      </Card>
    </motion.div>
  );
}