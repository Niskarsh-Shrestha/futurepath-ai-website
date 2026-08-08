"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle } from "lucide-react";
import { generateRoadmap } from "@/actions/roadmap/generate-roadmap";
import { RoadmapSkeleton } from "@/components/roadmap/roadmap-skeleton";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Typography } from "@/components/ui/typography";
import { Container } from "@/components/common/container";

interface GenerateRoadmapTriggerProps {
  recommendationId: string;
  careerName: string;
}

/**
 * Rendered when a CareerRecommendation has no LearningRoadmap yet.
 * Auto-triggers generation on mount (same pattern as
 * GenerateAnalysisTrigger from the AI Analysis phase), shows the
 * roadmap skeleton while the (fast, deterministic — no AI call)
 * generation runs, then redirects to this same recommendation's
 * roadmap route once done.
 */
export function GenerateRoadmapTrigger({ recommendationId, careerName }: GenerateRoadmapTriggerProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  // A mutable latch, not render-driving state — useRef avoids the
  // set-state-in-effect pattern entirely, since this value is only
  // ever read/written to guard against re-triggering the effect,
  // never used to produce visible output on its own.
  const startedRef = useRef(false);

  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;
    startTransition(async () => {
      const result = await generateRoadmap(recommendationId);
      if (!result.success) {
        setError(result.error ?? "Failed to generate roadmap");
        return;
      }
      router.push(`/dashboard/roadmap/${recommendationId}`);
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
            Couldn&apos;t generate roadmap
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

  return (
    <Container className="max-w-2xl py-10 text-center">
      <Typography variant="bodySmall" className="mb-6 text-muted-foreground">
        Generating {careerName}&apos;s learning roadmap...
      </Typography>
      <RoadmapSkeleton />
    </Container>
  );
}