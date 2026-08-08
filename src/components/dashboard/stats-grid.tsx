"use client";

import { ClipboardCheck, TrendingUp, Award, CheckCircle2 } from "lucide-react";

import { StatCard, type StatCardData } from "@/components/dashboard/stat-card";

interface StatsGridProps {
  totalChildren: number;
  completedAssessments: number;
  assessmentProgress: number;
}

export function StatsGrid({
  totalChildren,
  completedAssessments,
  assessmentProgress,
}: StatsGridProps) {
  const stats: StatCardData[] = [
    {
      icon: ClipboardCheck,
      value: totalChildren,
      label: "Children",
      trend: {
        direction: "flat",
        label: "Profiles",
      },
    },
    {
      icon: CheckCircle2,
      value: completedAssessments,
      label: "Completed Assessments",
      trend: {
        direction: completedAssessments > 0 ? "up" : "flat",
        label:
          completedAssessments > 0
            ? "Completed"
            : "Not started",
      },
    },
    {
      icon: TrendingUp,
      value: `${assessmentProgress}%`,
      label: "Assessment Progress",
      trend: {
        direction:
          assessmentProgress >= 75
            ? "up"
            : assessmentProgress > 0
              ? "flat"
              : "down",
        label:
          assessmentProgress >= 75
            ? "Strong progress"
            : assessmentProgress > 0
              ? "In progress"
              : "Not started",
      },
    },
    {
      icon: Award,
      value: completedAssessments,
      label: "AI Insights",
      trend: {
        direction: completedAssessments > 0 ? "up" : "flat",
        label:
          completedAssessments > 0
            ? "Available"
            : "Pending",
      },
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <StatCard
          key={stat.label}
          data={stat}
          index={index}
        />
      ))}
    </div>
  );
}