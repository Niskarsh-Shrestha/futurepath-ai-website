"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface CareerScoreProps {
  score: number;
  size?: "sm" | "md" | "lg";
}

const SIZE_CONFIG = {
  sm: { box: 44, stroke: 5, text: "text-xs" },
  md: { box: 60, stroke: 6, text: "text-sm" },
  lg: { box: 88, stroke: 7, text: "text-lg" },
};

function getScoreColor(score: number): string {
  if (score >= 75) return "var(--success)";
  if (score >= 50) return "var(--primary)";
  return "var(--warning)";
}

export function CareerScore({ score, size = "md" }: CareerScoreProps) {
  const { box, stroke, text } = SIZE_CONFIG[size];
  const radius = (box - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const center = box / 2;

  return (
    <div className="relative shrink-0" style={{ width: box, height: box }}>
      <svg viewBox={`0 0 ${box} ${box}`} className="h-full w-full -rotate-90">
        <circle cx={center} cy={center} r={radius} fill="none" stroke="var(--secondary)" strokeWidth={stroke} />
        <motion.circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={getScoreColor(score)}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        />
      </svg>
      <div className={cn("absolute inset-0 flex items-center justify-center font-bold text-foreground", text)}>
        {score}%
      </div>
    </div>
  );
}