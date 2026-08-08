"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle } from "lucide-react";
import { generateReport } from "@/actions/reports/generate-report";
import { ReportSkeleton } from "@/components/reports/report-skeleton";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Typography } from "@/components/ui/typography";
import { Container } from "@/components/common/container";

interface GenerateReportTriggerProps {
  recommendationId: string;
}

/**
 * Same auto-trigger-on-mount pattern as GenerateAnalysisTrigger (Task 8)
 * and GenerateRecommendationsTrigger (Task 9): generation happens as
 * part of navigating to the report, not a separate deliberate click.
 */
export function GenerateReportTrigger({ recommendationId }: GenerateReportTriggerProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const startedRef = useRef(false);

  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;
    startTransition(async () => {
      const result = await generateReport(recommendationId);
      if (!result.success) {
        setError(result.error ?? "Failed to generate report");
        return;
      }
      router.refresh();
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recommendationId]);

  function handleRetry() {
    setError(null);
    startedRef.current = false;
  }

  if (error) {
    return (
      <Container className="max-w-2xl py-16">
        <Card className="flex flex-col items-center rounded-2xl border border-destructive/30 bg-white p-8 text-center shadow-sm">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10">
            <AlertTriangle className="h-6 w-6 text-destructive" aria-hidden="true" />
          </span>
          <Typography variant="title" as="h2" className="mt-4 font-semibold text-foreground">
            Couldn&apos;t generate report
          </Typography>
          <Typography variant="bodySmall" className="mt-1.5 text-muted-foreground">
            {error}
          </Typography>
          <Button variant="primary" size="md" className="mt-6" onClick={handleRetry} loading={isPending}>
            Try Again
          </Button>
        </Card>
      </Container>
    );
  }

  return <ReportSkeleton />;
}