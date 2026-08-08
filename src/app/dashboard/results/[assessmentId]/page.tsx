import { notFound, redirect } from "next/navigation";
import { Map } from "lucide-react";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { GenerateAnalysisTrigger } from "@/components/results/generate-analysis-trigger";
import { RegenerateAnalysisButton } from "@/components/results/regenerate-analysis-button";
import { ResultsLayout } from "@/components/results/results-layout";
import { AnalysisSummary } from "@/components/results/analysis-summary";
import { StrengthsCard } from "@/components/results/strengths-card";
import { WeaknessesCard } from "@/components/results/weaknesses-card";
import { CareerMatchCard } from "@/components/results/career-match-card";
import { Button } from "@/components/ui/button";
import { Typography } from "@/components/ui/typography";

interface ResultsPageProps {
  params: Promise<{ assessmentId: string }>;
}

function calculateAge(dateOfBirth: Date): number {
  const today = new Date();
  let age = today.getFullYear() - dateOfBirth.getFullYear();
  const monthDiff = today.getMonth() - dateOfBirth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dateOfBirth.getDate())) age--;
  return age;
}

export default async function ResultsPage({ params }: ResultsPageProps) {
  const { assessmentId } = await params;
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const assessment = await db.assessment.findUnique({
    where: { id: assessmentId },
    include: {
      child: true,
      aiAnalysis: { include: { careerMatches: { orderBy: { score: "desc" } } } },
    },
  });

  if (!assessment || assessment.child.userId !== session.user.id) {
    notFound();
  }

  if (assessment.status !== "SUBMITTED") {
    redirect(`/dashboard/assessment/${assessment.id}/review`);
  }

  if (!assessment.aiAnalysis) {
    return <GenerateAnalysisTrigger assessmentId={assessment.id} />;
  }

  const analysis = assessment.aiAnalysis;
  const childAge = calculateAge(assessment.child.dateOfBirth);

  return (
    <ResultsLayout
      header={
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <Typography variant="h3" as="h1" className="font-bold text-foreground">
              AI Analysis Results
            </Typography>
            <Typography variant="bodySmall" className="mt-1 text-muted-foreground">
              {assessment.child.firstName}, age {childAge}
            </Typography>
          </div>
          <div className="flex gap-2">
            <RegenerateAnalysisButton assessmentId={assessment.id} />
            <Button variant="primary" size="md" leftIcon={<Map className="h-4 w-4" />} disabled>
              Generate Roadmap
            </Button>
          </div>
        </div>
      }
    >
      <AnalysisSummary
        childName={assessment.child.firstName}
        summary={analysis.summary}
        personalityAnalysis={analysis.personalityAnalysis}
        learningStyleAnalysis={analysis.learningStyleAnalysis}
        careerInterestAnalysis={analysis.careerInterestAnalysis}
        confidenceScore={analysis.confidenceScore}
        analysisDate={analysis.createdAt}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <StrengthsCard strengths={analysis.strengths} />
        <WeaknessesCard weaknesses={analysis.weaknesses} />
      </div>

      <div className="space-y-3">
        <Typography variant="title" as="h3" className="font-semibold text-foreground">
          Career Matches
        </Typography>
        {analysis.careerMatches.map((match, index) => (
          <CareerMatchCard
            key={match.id}
            career={match.career}
            score={match.score}
            reason={match.reason}
            rank={index + 1}
          />
        ))}
      </div>
    </ResultsLayout>
  );
}