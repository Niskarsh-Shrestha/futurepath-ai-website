import Link from "next/link";
import { redirect } from "next/navigation";
import { Map, ArrowRight } from "lucide-react";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { buildRoadmapView } from "@/lib/roadmap/timeline";

import type {
  LearningResourceType,
  LearningResourceProvider,
} from "@/lib/roadmap/roadmap-types";

import { ProgressRing } from "@/components/roadmap/progress-ring";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Typography } from "@/components/ui/typography";
import { EmptyState } from "@/components/ui/empty-state";
import { Container } from "@/components/common/container";

function estimateCompletionDate(
  phases: { isComplete: boolean; estimatedWeeks: number }[]
): string {
  const remainingWeeks = phases
    .filter((phase) => !phase.isComplete)
    .reduce((sum, phase) => sum + phase.estimatedWeeks, 0);

  if (remainingWeeks === 0) {
    return "Complete";
  }

  const date = new Date();

  date.setDate(date.getDate() + remainingWeeks * 7);

  return date.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
}

/**
 * Prisma stores LearningResource.type and provider as String.
 * The roadmap view layer uses strict union types.
 *
 * Normalize the Prisma result before passing it to buildRoadmapView.
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

export default async function RoadmapIndexPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  /*
   * Only count recommendations belonging to the
   * currently authenticated user's children.
   */
  const recommendationCount = await db.careerRecommendation.count({
    where: {
      analysis: {
        assessment: {
          child: {
            userId: session.user.id,
          },
        },
      },
    },
  });

  /*
   * No recommendations yet.
   */
  if (recommendationCount === 0) {
    return (
      <Container className="max-w-lg py-16">
        <EmptyState
          icon={Map}
          title="Complete your assessment first"
          description="Complete an assessment to receive career recommendations and generate a learning roadmap."
        />

        <div className="mt-4 text-center">
          <Button variant="primary" size="md" asChild>
            <Link href="/dashboard/assessment">
              Go to Assessment
            </Link>
          </Button>
        </div>
      </Container>
    );
  }

  /*
   * Get all roadmaps belonging to the authenticated user.
   */
  const roadmaps = await db.learningRoadmap.findMany({
    where: {
      recommendation: {
        analysis: {
          assessment: {
            child: {
              userId: session.user.id,
            },
          },
        },
      },
    },

    include: {
      recommendation: true,

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

    orderBy: {
      createdAt: "desc",
    },
  });

  /*
   * No roadmap has been generated yet.
   */
  if (roadmaps.length === 0) {
    const topRecommendation =
      await db.careerRecommendation.findFirst({
        where: {
          analysis: {
            assessment: {
              child: {
                userId: session.user.id,
              },
            },
          },
        },

        orderBy: {
          matchScore: "desc",
        },
      });

    return (
      <Container className="max-w-lg py-16">
        <EmptyState
          icon={Map}
          title="No learning roadmap yet"
          description="Generate your first learning roadmap based on your top career recommendation."
        />

        {topRecommendation && (
          <div className="mt-4 text-center">
            <Button variant="primary" size="md" asChild>
              <Link
                href={`/dashboard/roadmap/${topRecommendation.id}`}
              >
                Generate Roadmap for{" "}
                {topRecommendation.careerTitle}
              </Link>
            </Button>
          </div>
        )}
      </Container>
    );
  }

  /*
   * The query is ordered newest first, so the first roadmap
   * is the latest roadmap.
   */
  const [latest, ...others] = roadmaps;

  /*
   * Normalize Prisma's string fields before using buildRoadmapView.
   */
  const normalizedLatestRoadmap = normalizeRoadmap(latest);

  const latestView = buildRoadmapView(normalizedLatestRoadmap);

  const estimatedCompletion = estimateCompletionDate(
    latestView.phases
  );

  return (
    <Container className="max-w-4xl space-y-6 pb-12">
      {/* Page Header */}
      <div>
        <Typography
          variant="title"
          as="h1"
          className="font-semibold text-foreground"
        >
          Learning Roadmap
        </Typography>

        <Typography
          variant="bodySmall"
          className="mt-1 text-muted-foreground"
        >
          Track progress toward{" "}
          {latest.recommendation.careerTitle}.
        </Typography>
      </div>

      {/* Latest Roadmap */}
      <Card className="rounded-2xl border border-border bg-white p-7 shadow-sm">
        <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10">
              <Map
                className="h-5 w-5 text-primary"
                aria-hidden="true"
              />
            </span>

            <div>
              <Badge variant="subtle" size="sm">
                {latest.recommendation.careerTitle}
              </Badge>

              <Typography
                variant="title"
                as="h2"
                className="mt-1 font-semibold text-foreground"
              >
                {latestView.title}
              </Typography>
            </div>
          </div>

          <ProgressRing
            percent={latestView.overallProgress}
            size="md"
          />
        </div>

        {/* Roadmap Details */}
        <div className="mt-6 grid grid-cols-1 gap-4 border-t border-border pt-6 sm:grid-cols-3">
          <div>
            <Typography
              variant="caption"
              className="text-muted-foreground"
            >
              Current Phase
            </Typography>

            <Typography
              variant="bodySmall"
              className="mt-0.5 font-medium text-foreground"
            >
              {latestView.currentPhase?.title ??
                "All phases complete"}
            </Typography>
          </div>

          <div>
            <Typography
              variant="caption"
              className="text-muted-foreground"
            >
              Next Milestone
            </Typography>

            <Typography
              variant="bodySmall"
              className="mt-0.5 font-medium text-foreground"
            >
              {latestView.nextMilestone?.title ??
                "None remaining"}
            </Typography>
          </div>

          <div>
            <Typography
              variant="caption"
              className="text-muted-foreground"
            >
              Estimated Completion
            </Typography>

            <Typography
              variant="bodySmall"
              className="mt-0.5 font-medium text-foreground"
            >
              {estimatedCompletion}
            </Typography>
          </div>
        </div>

        {/* Continue */}
        <Button
          variant="primary"
          size="md"
          className="mt-6 w-full"
          rightIcon={
            <ArrowRight
              className="h-4 w-4"
              aria-hidden="true"
            />
          }
          asChild
        >
          <Link
            href={`/dashboard/roadmap/${latest.recommendationId}`}
          >
            Continue Roadmap
          </Link>
        </Button>
      </Card>

      {/* Other Roadmaps */}
      {others.length > 0 && (
        <div>
          <Typography
            variant="title"
            as="h3"
            className="font-semibold text-foreground"
          >
            Other Roadmaps
          </Typography>

          <div className="mt-3 space-y-3">
            {others.map((roadmap) => (
              <Card
                key={roadmap.id}
                className="flex items-center justify-between rounded-xl border border-border bg-white p-4 shadow-sm"
              >
                <div>
                  <Typography
                    variant="bodySmall"
                    className="font-medium text-foreground"
                  >
                    {roadmap.recommendation.careerTitle}
                  </Typography>

                  <Typography
                    variant="caption"
                    className="text-muted-foreground"
                  >
                    Created{" "}
                    {roadmap.createdAt.toLocaleDateString()}
                  </Typography>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  asChild
                >
                  <Link
                    href={`/dashboard/roadmap/${roadmap.recommendationId}`}
                  >
                    View
                  </Link>
                </Button>
              </Card>
            ))}
          </div>
        </div>
      )}
    </Container>
  );
}