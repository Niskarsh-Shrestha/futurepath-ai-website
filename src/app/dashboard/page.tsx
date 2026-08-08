import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowRight, Map } from "lucide-react";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { buildRoadmapView } from "@/lib/roadmap/timeline";

import { WelcomeCard } from "@/components/dashboard/welcome-card";
import { StatsGrid } from "@/components/dashboard/stats-grid";
import { QuickActions } from "@/components/dashboard/quick-actions";
import {
  ActivityTimeline,
  type ActivityEntry,
} from "@/components/dashboard/activity-timeline";
import {
  AiStatusCard,
  type AiStatusData,
} from "@/components/dashboard/ai-status-card";
import { Notifications } from "@/components/dashboard/notifications";
import { ProgressRing } from "@/components/roadmap/progress-ring";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Typography } from "@/components/ui/typography";

function timeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);

  if (seconds < 60) return "Just now";

  const minutes = Math.floor(seconds / 60);

  if (minutes < 60) {
    return `${minutes}m ago`;
  }

  const hours = Math.floor(minutes / 60);

  if (hours < 24) {
    return `${hours}h ago`;
  }

  const days = Math.floor(hours / 24);

  if (days === 1) {
    return "Yesterday";
  }

  return `${days} days ago`;
}

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const firstName = session.user.name?.split(" ")[0] ?? "there";

  const children = await db.child.findMany({
    where: {
      userId: session.user.id,
    },
    orderBy: {
      createdAt: "asc",
    },
    include: {
      assessments: {
        orderBy: {
          updatedAt: "desc",
        },
        take: 1,
        include: {
          aiAnalysis: {
            include: {
              careerMatches: true,
            },
          },
        },
      },
    },
  });

  const totalChildren = children.length;

  const assessments = children
    .map((child) => child.assessments[0])
    .filter(Boolean);

  const completedAssessments = assessments.filter(
    (assessment) => assessment?.status === "SUBMITTED"
  ).length;

  /*
   * Average assessment progress across the user's children.
   * StatsGrid expects this value under the assessmentProgress prop.
   */
  const avgProgress =
    assessments.length > 0
      ? Math.round(
          assessments.reduce(
            (sum, assessment) => sum + (assessment?.progress ?? 0),
            0
          ) / assessments.length
        )
      : 0;

  let aiStatusData: AiStatusData = {
    hasAnalysis: false,
  };

  let latestAnalysisChild: (typeof children)[number] | null = null;
  let latestAnalysisUpdatedAt = new Date(0);

  for (const child of children) {
    const analysis = child.assessments[0]?.aiAnalysis;

    if (analysis && analysis.updatedAt > latestAnalysisUpdatedAt) {
      latestAnalysisUpdatedAt = analysis.updatedAt;
      latestAnalysisChild = child;
    }
  }

  if (latestAnalysisChild) {
    const assessment = latestAnalysisChild.assessments[0];
    const analysis = assessment?.aiAnalysis;

    if (assessment && analysis) {
      const topMatch = [...analysis.careerMatches].sort(
        (a, b) => b.score - a.score
      )[0];

      aiStatusData = {
        hasAnalysis: true,
        childName: latestAnalysisChild.firstName,
        assessmentId: assessment.id,
        lastAnalysis: timeAgo(analysis.updatedAt),
        confidenceScore: analysis.confidenceScore,
        topCareerMatch: topMatch?.career ?? "—",
      };
    }
  }

  /*
   * Get the latest roadmap belonging to this authenticated user's children.
   */
  const latestRoadmap = await db.learningRoadmap.findFirst({
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
   * Prisma stores resource type/provider as strings.
   * buildRoadmapView expects the strongly typed roadmap view shape.
   */
  const roadmapView = latestRoadmap
    ? buildRoadmapView({
        id: latestRoadmap.id,
        recommendationId: latestRoadmap.recommendationId,
        title: latestRoadmap.title,
        description: latestRoadmap.description,
        estimatedDuration: latestRoadmap.estimatedDuration,
        difficulty: latestRoadmap.difficulty,

        phases: latestRoadmap.phases.map((phase) => ({
          id: phase.id,
          title: phase.title,
          description: phase.description,
          order: phase.order,
          estimatedWeeks: phase.estimatedWeeks,

          resources: phase.resources.map((resource) => ({
            id: resource.id,
            title: resource.title,

            type: resource.type as Parameters<
              typeof buildRoadmapView
            >[0]["phases"][number]["resources"][number]["type"],

            provider: resource.provider as Parameters<
              typeof buildRoadmapView
            >[0]["phases"][number]["resources"][number]["provider"],

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
      })
    : null;

  interface RawActivityEntry {
    id: string;
    title: string;
    date: Date;
    status: ActivityEntry["status"];
  }

  const rawActivity: RawActivityEntry[] = [];

  for (const child of children) {
    rawActivity.push({
      id: `child-${child.id}`,
      title: `Added ${child.firstName}'s profile`,
      date: child.createdAt,
      status: "completed",
    });

    const assessment = child.assessments[0];

    if (assessment) {
      rawActivity.push({
        id: `assessment-${assessment.id}`,
        title:
          assessment.status === "SUBMITTED"
            ? `${child.firstName}'s assessment submitted`
            : `${child.firstName}'s assessment ${
                assessment.status === "IN_PROGRESS"
                  ? "in progress"
                  : "started"
              }`,
        date: assessment.updatedAt,
        status:
          assessment.status === "SUBMITTED" ? "completed" : "updated",
      });

      if (assessment.aiAnalysis) {
        rawActivity.push({
          id: `analysis-${assessment.aiAnalysis.id}`,
          title: `AI generated ${child.firstName}'s analysis`,
          date: assessment.aiAnalysis.createdAt,
          status: "generated",
        });
      }
    }
  }

  const recentActivity: ActivityEntry[] = rawActivity
    .sort((a, b) => b.date.getTime() - a.date.getTime())
    .slice(0, 6)
    .map((item) => ({
      id: item.id,
      title: item.title,
      timestamp: timeAgo(item.date),
      status: item.status,
    }));

  return (
    <div className="space-y-6">
      <WelcomeCard firstName={firstName} />

      <StatsGrid
        totalChildren={totalChildren}
        completedAssessments={completedAssessments}
        assessmentProgress={avgProgress}
      />

      <QuickActions />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <ActivityTimeline activity={recentActivity} />
          <Notifications />
        </div>

        <div className="space-y-6 lg:col-span-1">
          <AiStatusCard data={aiStatusData} />

          {roadmapView && latestRoadmap ? (
            <Card className="rounded-2xl border border-border bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10">
                  <Map
                    className="h-5 w-5 text-primary"
                    aria-hidden="true"
                  />
                </span>

                <ProgressRing
                  percent={roadmapView.overallProgress}
                  size="sm"
                />
              </div>

              <Typography
                variant="title"
                as="h3"
                className="mt-4 font-semibold text-foreground"
              >
                Learning Roadmap
              </Typography>

              <Typography
                variant="caption"
                className="mt-0.5 text-muted-foreground"
              >
                {latestRoadmap.recommendation.careerTitle}
              </Typography>

              <div className="mt-4 space-y-2 rounded-xl bg-secondary/60 p-4">
                <div>
                  <Typography
                    variant="caption"
                    className="text-muted-foreground"
                  >
                    Current Phase
                  </Typography>

                  <Typography
                    variant="bodySmall"
                    className="font-medium text-foreground"
                  >
                    {roadmapView.currentPhase?.title ??
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
                    className="font-medium text-foreground"
                  >
                    {roadmapView.nextMilestone?.title ??
                      "None remaining"}
                  </Typography>
                </div>
              </div>

              <Button
                variant="primary"
                size="md"
                className="mt-4 w-full"
                rightIcon={<ArrowRight className="h-4 w-4" />}
                asChild
              >
                <Link
                  href={`/dashboard/roadmap/${latestRoadmap.recommendationId}`}
                >
                  Continue Roadmap
                </Link>
              </Button>
            </Card>
          ) : (
            <Card className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-white p-6 text-center shadow-sm">
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-secondary">
                <Map
                  className="h-5 w-5 text-muted-foreground"
                  aria-hidden="true"
                />
              </span>

              <Typography
                variant="title"
                as="h3"
                className="mt-3 font-semibold text-foreground"
              >
                No learning roadmap yet
              </Typography>

              <Typography
                variant="bodySmall"
                className="mt-1.5 text-muted-foreground"
              >
                Generate a roadmap from your career recommendations.
              </Typography>

              <Button
                variant="outline"
                size="sm"
                className="mt-4"
                asChild
              >
                <Link href="/dashboard/careers">
                  View Careers
                </Link>
              </Button>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}