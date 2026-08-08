"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { createOrResumeAssessment } from "@/actions/assessment/create-assessment";
import { Card } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Typography } from "@/components/ui/typography";
import { useToast } from "@/components/ui/toast";
import { STATUS_DISPLAY } from "@/lib/mock/assessment";
import type { AssessmentStatus } from "@prisma/client";

export interface ChildAssessmentSummary {
  childId: string;
  childName: string;
  childImage: string | null;
  assessmentId: string | null;
  status: AssessmentStatus | null;
  progress: number;
}

interface SectionCardProps {
  summary: ChildAssessmentSummary;
}

export function SectionCard({ summary }: SectionCardProps) {
  const router = useRouter();
  const { showToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const initials = summary.childName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  const statusInfo = summary.status ? STATUS_DISPLAY[summary.status] : null;

  async function handleStart() {
    setIsLoading(true);
    const result = await createOrResumeAssessment(summary.childId);
    setIsLoading(false);

    if (!result.success || !result.assessmentId) {
      showToast(result.error ?? "Failed to start assessment", "error");
      return;
    }

    if (summary.status === "SUBMITTED") {
      router.push(`/dashboard/assessment/${result.assessmentId}/review`);
    } else {
      router.push(`/dashboard/assessment/${result.assessmentId}`);
    }
  }

  const ctaLabel =
    !summary.status || summary.status === "DRAFT"
      ? "Start Assessment"
      : summary.status === "SUBMITTED"
        ? "View Submission"
        : "Resume Assessment";

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      <Card className="rounded-2xl border border-border bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
        <div className="flex items-center gap-3">
          <Avatar alt={summary.childName} fallback={initials} src={summary.childImage ?? undefined} size="lg" />
          <div className="min-w-0 flex-1">
            <Typography variant="title" as="h3" className="truncate font-semibold text-foreground">
              {summary.childName}
            </Typography>
            {statusInfo && (
              <Badge variant={statusInfo.badgeVariant} size="sm" className="mt-1">
                {statusInfo.label}
              </Badge>
            )}
          </div>
        </div>

        {summary.status && summary.status !== "DRAFT" && (
          <div className="mt-4">
            <div className="h-2 overflow-hidden rounded-full bg-secondary">
              <div className="h-full rounded-full bg-primary" style={{ width: `${summary.progress}%` }} />
            </div>
            <Typography variant="caption" className="mt-1 block text-muted-foreground">
              {summary.progress}% complete
            </Typography>
          </div>
        )}

        <Button
          variant="primary"
          size="md"
          className="mt-5 w-full"
          rightIcon={<ArrowRight className="h-4 w-4" />}
          loading={isLoading}
          onClick={handleStart}
        >
          {ctaLabel}
        </Button>
      </Card>
    </motion.div>
  );
}