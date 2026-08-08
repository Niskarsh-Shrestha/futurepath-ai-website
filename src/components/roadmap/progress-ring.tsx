"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ProgressRingProps {
  percent: number;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const SIZE_CONFIG = {
  sm: { box: 48, stroke: 5, text: "text-xs" },
  md: { box: 72, stroke: 6, text: "text-base" },
  lg: { box: 100, stroke: 8, text: "text-xl" },
};

function getRingColor(percent: number): string {
  if (percent >= 100) return "var(--success)";
  if (percent >= 40) return "var(--primary)";
  return "var(--warning)";
}

export function ProgressRing({ percent, size = "md", className }: ProgressRingProps) {
  const { box, stroke, text } = SIZE_CONFIG[size];
  const radius = (box - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percent / 100) * circumference;
  const center = box / 2;

  return (
    <div
      className={cn("relative shrink-0", className)}
      style={{ width: box, height: box }}
      role="progressbar"
      aria-valuenow={percent}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <svg viewBox={`0 0 ${box} ${box}`} className="h-full w-full -rotate-90">
        <circle cx={center} cy={center} r={radius} fill="none" stroke="var(--secondary)" strokeWidth={stroke} />
        <motion.circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={getRingColor(percent)}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        />
      </svg>
      <div className={cn("absolute inset-0 flex items-center justify-center font-bold text-foreground", text)}>
        {percent}%
      </div>
    </div>
  );
}