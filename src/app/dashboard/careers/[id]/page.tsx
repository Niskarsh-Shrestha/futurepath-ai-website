import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, Map, FileText } from "lucide-react";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { getCareerById } from "@/lib/careers/career-data";
import { buildAdvantagesAndChallenges } from "@/lib/careers/recommendation-builder";
import { CareerHero } from "@/components/careers/career-hero";
import { SalaryCard } from "@/components/careers/salary-card";
import { DemandCard } from "@/components/careers/demand-card";
import { CareerPathCard } from "@/components/careers/career-path-card";
import { SkillGapCard } from "@/components/careers/skill-gap-card";
import { AdvantagesChallengesCard } from "@/components/careers/advantages-challenges-card";
import { Container } from "@/components/common/container";
import { Typography } from "@/components/ui/typography";
import { Button } from "@/components/ui/button";

interface CareerDetailsPageProps {
  params: Promise<{ id: string }>;
}

export default async function CareerDetailsPage({ params }: CareerDetailsPageProps) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const recommendation = await db.careerRecommendation.findUnique({
    where: { id },
    include: {
      analysis: { include: { assessment: { include: { child: true } } } },
      careerPath: { orderBy: { order: "asc" } },
      skillGaps: true,
      roadmap: { select: { id: true } },
      report: { select: { id: true } },
    },
  });

  if (!recommendation || recommendation.analysis.assessment.child.userId !== session.user.id) {
    notFound();
  }

  const staticRecord = getCareerById(
    recommendation.careerTitle.toLowerCase().replace(/[^a-z0-9]+/g, "-")
  );

  const { advantages, challenges } = staticRecord
    ? buildAdvantagesAndChallenges(staticRecord)
    : { advantages: [], challenges: [] };

  return (
    <Container className="max-w-4xl space-y-6 py-10">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link
          href="/dashboard/careers"
          className="inline-flex items-center gap-1 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <ChevronLeft className="h-4 w-4" aria-hidden="true" />
          Back to Careers
        </Link>

        <div className="flex gap-2">
          <Button variant="outline" size="md" leftIcon={<Map className="h-4 w-4" />} asChild>
            <Link href={`/dashboard/roadmap/${recommendation.id}`}>
              {recommendation.roadmap ? "View Learning Roadmap" : "Generate Learning Roadmap"}
            </Link>
          </Button>
          <Button variant="primary" size="md" leftIcon={<FileText className="h-4 w-4" />} asChild>
            <Link href={`/dashboard/reports/${recommendation.id}`}>
              {recommendation.report ? "View Report" : "Generate Report"}
            </Link>
          </Button>
        </div>
      </div>

      <CareerHero
        careerTitle={recommendation.careerTitle}
        careerCategory={recommendation.careerCategory}
        matchScore={recommendation.matchScore}
        description={recommendation.description}
      />

      <div>
        <Typography variant="title" as="h2" className="font-semibold text-foreground">
          Why this fits
        </Typography>
        <Typography variant="bodySmall" className="mt-1.5 leading-relaxed text-muted-foreground">
          {recommendation.reasoning}
        </Typography>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <SalaryCard salaryRange={recommendation.salaryRange} />
        <DemandCard futureDemand={recommendation.futureDemand as "Low" | "Moderate" | "High" | "Very High"} />
      </div>

      {advantages.length > 0 && challenges.length > 0 && (
        <AdvantagesChallengesCard advantages={advantages} challenges={challenges} />
      )}

      <CareerPathCard steps={recommendation.careerPath} />

      {recommendation.skillGaps.length > 0 && <SkillGapCard skillGaps={recommendation.skillGaps} />}
    </Container>
  );
}