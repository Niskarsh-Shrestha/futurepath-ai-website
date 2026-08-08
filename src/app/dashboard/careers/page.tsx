import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { GitCompareArrows } from "lucide-react";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { getLatestRecommendations } from "@/lib/careers/get-latest-recommendations";
import { GenerateRecommendationsTrigger } from "@/components/careers/generate-recommendations-trigger";
import { CategoryFilter } from "@/components/careers/category-filter";
import { Container } from "@/components/common/container";
import { Typography } from "@/components/ui/typography";
import { Button } from "@/components/ui/button";
import type { CareerCardData } from "@/components/careers/career-card";

interface CareersPageProps {
  searchParams: Promise<{ childId?: string }>;
}

export default async function CareersPage({ searchParams }: CareersPageProps) {
  const { childId } = await searchParams;
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  if (!childId) {
    const firstChild = await db.child.findFirst({
      where: { userId: session.user.id },
      orderBy: { createdAt: "asc" },
    });
    if (!firstChild) redirect("/dashboard");
    redirect(`/dashboard/careers?childId=${firstChild.id}`);
  }

  const child = await db.child.findUnique({ where: { id: childId } });
  if (!child || child.userId !== session.user.id) {
    notFound();
  }

  const { analysis: latestAnalysis } = await getLatestRecommendations(child.id);

  if (!latestAnalysis) {
    return (
      <Container className="max-w-2xl py-16 text-center">
        <Typography variant="title" as="h1" className="font-semibold text-foreground">
          No career recommendations yet
        </Typography>
        <Typography variant="bodySmall" className="mt-1.5 text-muted-foreground">
          Complete an assessment for {child.firstName} to generate career recommendations.
        </Typography>
      </Container>
    );
  }

  if (latestAnalysis.recommendations.length === 0) {
    return <GenerateRecommendationsTrigger analysisId={latestAnalysis.id} />;
  }

  const careers: CareerCardData[] = latestAnalysis.recommendations
    .sort((a, b) => b.matchScore - a.matchScore)
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
    <Container className="max-w-5xl space-y-6 py-10">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <Typography variant="h3" as="h1" className="font-bold text-foreground">
            Career Recommendations
          </Typography>
          <Typography variant="bodySmall" className="mt-1 text-muted-foreground">
            Personalized matches for {child.firstName}, ranked by fit
          </Typography>
        </div>
        {careers.length >= 2 && (
          <Button variant="outline" size="md" leftIcon={<GitCompareArrows className="h-4 w-4" />} asChild>
            <Link href={`/dashboard/careers/compare?childId=${child.id}`}>Compare Careers</Link>
          </Button>
        )}
      </div>
      <CategoryFilter careers={careers} />
    </Container>
  );
}