import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, AlertTriangle } from "lucide-react";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { getLatestRecommendations } from "@/lib/careers/get-latest-recommendations";
import { compareCareers } from "@/actions/careers/compare-careers";
import { CompareSelector } from "@/components/careers/compare-selector";
import { ComparisonTable } from "@/components/careers/comparison-table";
import { Container } from "@/components/common/container";
import { Card } from "@/components/ui/card";
import { Typography } from "@/components/ui/typography";
import type { CareerCardData } from "@/components/careers/career-card";

interface ComparePageProps {
  searchParams: Promise<{ childId?: string; a?: string; b?: string }>;
}

export default async function ComparePage({ searchParams }: ComparePageProps) {
  const { childId, a, b } = await searchParams;
  const session = await auth();
  if (!session?.user?.id) redirect("/login");
  if (!childId) redirect("/dashboard/careers");

  const child = await db.child.findUnique({ where: { id: childId } });
  if (!child || child.userId !== session.user.id) {
    notFound();
  }

  // Both IDs present — resolve the actual comparison via Module 2's
  // server action (which re-verifies ownership on both sides itself).
  if (a && b) {
    const result = await compareCareers(a, b);

    return (
      <Container className="max-w-4xl space-y-6 py-10">
        <Link
          href={`/dashboard/careers/compare?childId=${child.id}`}
          className="inline-flex items-center gap-1 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <ChevronLeft className="h-4 w-4" aria-hidden="true" />
          Choose different careers
        </Link>

        {result.success && result.careerA && result.careerB ? (
          <ComparisonTable careerA={result.careerA} careerB={result.careerB} />
        ) : (
          <Card className="flex flex-col items-center rounded-2xl border border-destructive/30 bg-white p-8 text-center shadow-sm">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10">
              <AlertTriangle className="h-6 w-6 text-destructive" aria-hidden="true" />
            </span>
            <Typography variant="title" as="h2" className="mt-4 font-semibold text-foreground">
              Couldn&apos;t load comparison
            </Typography>
            <Typography variant="bodySmall" className="mt-1.5 text-muted-foreground">
              {result.error ?? "One or both careers could not be found."}
            </Typography>
          </Card>
        )}
      </Container>
    );
  }

  // No selection yet — show the picker.
  const { analysis: latestAnalysis } = await getLatestRecommendations(child.id);

  if (!latestAnalysis || latestAnalysis.recommendations.length < 2) {
    return (
      <Container className="max-w-2xl py-16 text-center">
        <Typography variant="title" as="h1" className="font-semibold text-foreground">
          Not enough recommendations to compare
        </Typography>
        <Typography variant="bodySmall" className="mt-1.5 text-muted-foreground">
          {child.firstName} needs at least 2 career recommendations before they can be compared.
        </Typography>
      </Container>
    );
  }

  const careers: CareerCardData[] = latestAnalysis.recommendations
    .sort((r1, r2) => r2.matchScore - r1.matchScore)
    .map((r) => ({
      id: r.id,
      careerTitle: r.careerTitle,
      careerCategory: r.careerCategory,
      matchScore: r.matchScore,
      salaryRange: r.salaryRange,
      futureDemand: r.futureDemand,
      description: r.description,
    }));

  return (
    <Container className="max-w-3xl space-y-6 py-10">
      <div>
        <Link
          href={`/dashboard/careers?childId=${child.id}`}
          className="inline-flex items-center gap-1 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <ChevronLeft className="h-4 w-4" aria-hidden="true" />
          Back to Careers
        </Link>
        <Typography variant="h3" as="h1" className="mt-3 font-bold text-foreground">
          Compare Careers
        </Typography>
      </div>
      <CompareSelector careers={careers} childId={child.id} />
    </Container>
  );
}