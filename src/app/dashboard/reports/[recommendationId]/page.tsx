import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, TrendingUp, Target, Map as MapIcon } from "lucide-react";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { buildRoadmapView } from "@/lib/roadmap/timeline";
import type {
  LearningResourceType,
  LearningResourceProvider,
} from "@/lib/roadmap/roadmap-types";

import { GenerateReportTrigger } from "@/components/reports/generate-report-trigger";
import { ReportHero } from "@/components/reports/report-hero";
import { ReportSection } from "@/components/reports/report-section";
import { SummaryCard } from "@/components/reports/summary-card";
import { TimelineSummary } from "@/components/reports/timeline-summary";
import { ReportActions } from "@/components/reports/report-actions";
import { ReportFooter } from "@/components/reports/report-footer";
import { Container } from "@/components/common/container";
import { Typography } from "@/components/ui/typography";
import { Badge } from "@/components/ui/badge";

interface ReportPageProps {
  params: Promise<{ recommendationId: string }>;
}

function calculateAge(dateOfBirth: Date): number {
  const today = new Date();

  let age = today.getFullYear() - dateOfBirth.getFullYear();

  const monthDiff = today.getMonth() - dateOfBirth.getMonth();

  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < dateOfBirth.getDate())
  ) {
    age--;
  }

  return age;
}

/**
 * Prisma stores roadmap resource type/provider as String.
 * The roadmap view layer intentionally uses stricter union types.
 *
 * These casts normalize the database values at the boundary so
 * buildRoadmapView receives the shape it expects.
 */
function normalizeRoadmap(roadmap: {
  id: string;
  recommendationId: string;
  title: string;
  description: string;
  estimatedDuration: string;
  difficulty: string;
  phases: Array<{
    id: string;
    title: string;
    description: string;
    order: number;
    estimatedWeeks: number;
    resources: Array<{
      id: string;
      title: string;
      type: string;
      provider: string;
      url: string;
      estimatedHours: number;
      isOptional: boolean;
      isFree: boolean;
      isCompleted: boolean;
    }>;
    milestones: Array<{
      id: string;
      title: string;
      description: string;
      order: number;
      isCompleted: boolean;
    }>;
  }>;
}) {
  return {
    id: roadmap.id,
    recommendationId: roadmap.recommendationId,
    title: roadmap.title,
    description: roadmap.description,
    estimatedDuration: roadmap.estimatedDuration,
    difficulty: roadmap.difficulty,

    phases: roadmap.phases.map((phase) => ({
      id: phase.id,
      title: phase.title,
      description: phase.description,
      order: phase.order,
      estimatedWeeks: phase.estimatedWeeks,

      resources: phase.resources.map((resource) => ({
        id: resource.id,
        title: resource.title,
        type: resource.type as LearningResourceType,
        provider: resource.provider as LearningResourceProvider,
        url: resource.url,
        estimatedHours: resource.estimatedHours,
        isOptional: resource.isOptional,
        isFree: resource.isFree,
        isCompleted: resource.isCompleted,
      })),

      milestones: phase.milestones.map((milestone) => ({
        id: milestone.id,
        title: milestone.title,
        description: milestone.description,
        order: milestone.order,
        isCompleted: milestone.isCompleted,
      })),
    })),
  };
}

export default async function ReportPage({ params }: ReportPageProps) {
  const { recommendationId } = await params;

  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const recommendation = await db.careerRecommendation.findUnique({
    where: {
      id: recommendationId,
    },

    include: {
      careerPath: {
        orderBy: {
          order: "asc",
        },
      },

      skillGaps: true,

      roadmap: {
        include: {
          phases: {
            include: {
              resources: true,
              milestones: true,
            },
            orderBy: {
              order: "asc",
            },
          },
        },
      },

      report: true,

      analysis: {
        include: {
          careerMatches: true,

          assessment: {
            include: {
              child: true,
            },
          },
        },
      },
    },
  });

  /**
   * Security:
   * Only allow the authenticated owner of the child assessment
   * to access this recommendation/report.
   */
  if (
    !recommendation ||
    recommendation.analysis.assessment.child.userId !== session.user.id
  ) {
    notFound();
  }

  /**
   * A report must exist before this page can display it.
   */
  if (!recommendation.report) {
    return (
      <Container className="py-10">
        <div className="mx-auto max-w-2xl text-center">
          <Typography
            variant="title"
            as="h1"
            className="font-semibold text-foreground"
          >
            Report not available yet
          </Typography>

          <Typography
            variant="body"
            className="mt-2 text-muted-foreground"
          >
            Your career report has not been generated yet.
          </Typography>

          <div className="mt-6">
            <GenerateReportTrigger
              recommendationId={recommendationId}
            />
          </div>
        </div>
      </Container>
    );
  }

  const { child } = recommendation.analysis.assessment;

  /**
   * Normalize Prisma's string-based roadmap resource fields
   * before passing the roadmap into the typed view builder.
   */
  const normalizedRoadmap = recommendation.roadmap
    ? normalizeRoadmap(recommendation.roadmap)
    : null;

  const roadmapView = normalizedRoadmap
    ? buildRoadmapView(normalizedRoadmap)
    : null;

  const highPriorityGaps = recommendation.skillGaps.filter(
    (gap) => gap.priority === "High"
  ).length;

  return (
    <Container className="py-8">
      {/* Back navigation */}
      <div className="mb-6">
        <Link
          href="/dashboard/reports"
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <ChevronLeft className="h-4 w-4" aria-hidden="true" />
          Back to Reports
        </Link>
      </div>

      {/* Report hero */}
      <ReportHero
        childName={`${child.firstName} ${child.lastName}`}
        childAge={calculateAge(child.dateOfBirth)}
        topCareerMatch={recommendation.careerTitle}
        confidenceScore={recommendation.analysis.confidenceScore}
        generatedAt={recommendation.report.generatedAt}
      />

      {/* Summary cards */}
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <SummaryCard
          label="Match Score"
          value={`${recommendation.matchScore}%`}
          icon={Target}
        />

        <SummaryCard
          label="Skill Gaps"
          value={`${highPriorityGaps} High Priority`}
          icon={TrendingUp}
          tone={highPriorityGaps > 0 ? "warning" : "success"}
        />

        <SummaryCard
          label="Roadmap Progress"
          value={
            roadmapView
              ? `${roadmapView.overallProgress}%`
              : "Not started"
          }
          icon={MapIcon}
          tone={
            roadmapView && roadmapView.overallProgress === 100
              ? "success"
              : "default"
          }
        />
      </div>

      {/* AI Analysis */}
      <div className="mt-6">
        <ReportSection
          title="AI Analysis Summary"
          description="Strengths, learning style, and personality insights"
        >
          <Typography
            variant="bodySmall"
            className="leading-relaxed text-muted-foreground"
          >
            {recommendation.analysis.summary}
          </Typography>

          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* Strengths */}
            <div>
              <Typography
                variant="bodySmall"
                className="font-semibold text-foreground"
              >
                Strengths
              </Typography>

              <ul className="mt-2 space-y-1.5">
                {recommendation.analysis.strengths.map((strength) => (
                  <li
                    key={strength}
                    className="flex gap-2"
                  >
                    <span
                      className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-success"
                      aria-hidden="true"
                    />

                    <Typography
                      variant="bodySmall"
                      className="text-muted-foreground"
                    >
                      {strength}
                    </Typography>
                  </li>
                ))}
              </ul>
            </div>

            {/* Areas for growth */}
            <div>
              <Typography
                variant="bodySmall"
                className="font-semibold text-foreground"
              >
                Areas for Growth
              </Typography>

              <ul className="mt-2 space-y-1.5">
                {recommendation.analysis.weaknesses.map((weakness) => (
                  <li
                    key={weakness}
                    className="flex gap-2"
                  >
                    <span
                      className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-warning"
                      aria-hidden="true"
                    />

                    <Typography
                      variant="bodySmall"
                      className="text-muted-foreground"
                    >
                      {weakness}
                    </Typography>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </ReportSection>
      </div>

      {/* Recommended Career */}
      <div className="mt-6">
        <ReportSection
          title="Recommended Career"
          description={recommendation.careerTitle}
        >
          <Typography
            variant="bodySmall"
            className="leading-relaxed text-muted-foreground"
          >
            {recommendation.reasoning}
          </Typography>

          <div className="mt-4 flex flex-wrap gap-2">
            <Badge variant="outline" size="sm">
              {recommendation.salaryRange}
            </Badge>

            <Badge variant="subtle" size="sm">
              {recommendation.futureDemand} demand
            </Badge>

            <Badge variant="subtle" size="sm">
              {recommendation.educationLevel}
            </Badge>
          </div>
        </ReportSection>
      </div>

      {/* Learning Roadmap */}
      {roadmapView && (
        <div className="mt-6">
          <ReportSection
            title="Learning Roadmap"
            description={`${roadmapView.phases.length} phases · ${roadmapView.estimatedDuration}`}
          >
            <TimelineSummary roadmap={roadmapView} />
          </ReportSection>
        </div>
      )}

      {/* Report actions */}
      <div className="mt-6">
        <ReportActions
          recommendationId={recommendationId}
        />
      </div>

      {/* Footer */}
      <div className="mt-8">
        <ReportFooter />
      </div>
    </Container>
  );
}