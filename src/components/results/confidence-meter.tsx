"use client";

import { motion } from "framer-motion";
import { Typography } from "@/components/ui/typography";
import { cn } from "@/lib/utils";

interface ConfidenceMeterProps {
  score: number;
}

function getConfidenceLabel(score: number): { label: string; colorClass: string } {
  if (score >= 80) return { label: "High confidence", colorClass: "text-success" };
  if (score >= 50) return { label: "Moderate confidence", colorClass: "text-warning" };
  return { label: "Low confidence", colorClass: "text-destructive" };
}

export function ConfidenceMeter({ score }: ConfidenceMeterProps) {
  const { label, colorClass } = getConfidenceLabel(score);
  const circumference = 2 * Math.PI * 40;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center">
      <div className="relative h-28 w-28">
        <svg viewBox="0 0 96 96" className="h-full w-full -rotate-90">
          <circle cx="48" cy="48" r="40" fill="none" stroke="var(--secondary)" strokeWidth="8" />
          <motion.circle
            cx="48"
            cy="48"
            r="40"
            fill="none"
            stroke="var(--primary)"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <Typography variant="h4" as="span" className="font-bold text-foreground">
            {score}%
          </Typography>
        </div>
      </div>
      <Typography variant="caption" className={cn("mt-2 font-medium", colorClass)}>
        {label}
      </Typography>
    </div>
  );
}