import { notFound, redirect } from "next/navigation";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { buildRoadmapView } from "@/lib/roadmap/timeline";
import { GenerateRoadmapTrigger } from "@/components/roadmap/generate-roadmap-trigger";
import { RoadmapHero } from "@/components/roadmap/roadmap-hero";
import { RoadmapProgress } from "@/components/roadmap/roadmap-progress";
import { RoadmapTimeline } from "@/components/roadmap/roadmap-timeline";
import { Container } from "@/components/common/container";

import type {
  LearningResourceType,
  LearningResourceProvider,
} from "@/lib/roadmap/roadmap-types";

interface RoadmapDetailPageProps {
  params: Promise<{ recommendationId: string }>;
}

export default async function RoadmapDetailPage({
  params,
}: RoadmapDetailPageProps) {
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
      analysis: {
        include: {
          assessment: {
            include: {
              child: true,
            },
          },
        },
      },

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
    },
  });

  /*
   * Make sure the recommendation exists and belongs
   * to the currently authenticated user's child.
   */
  if (!recommendation) {
    notFound();
  }

  const ownerId = recommendation.analysis.assessment.child.userId;

  if (ownerId !== session.user.id) {
    notFound();
  }

  /*
   * If a roadmap has not been generated yet,
   * show the roadmap generation trigger.
   */
  if (!recommendation.roadmap) {
    return (
      <GenerateRoadmapTrigger
        recommendationId={recommendation.id}
        careerName={recommendation.careerTitle}
      />
    );
  }

  /*
   * Prisma stores LearningResource.type and provider as String.
   *
   * roadmap-types.ts uses strict union types:
   * LearningResourceType
   * LearningResourceProvider
   *
   * The roadmap data is normalized here before being passed
   * into buildRoadmapView().
   */
  const normalizedRoadmap = {
    id: recommendation.roadmap.id,
    recommendationId: recommendation.roadmap.recommendationId,
    title: recommendation.roadmap.title,
    description: recommendation.roadmap.description,
    estimatedDuration: recommendation.roadmap.estimatedDuration,
    difficulty: recommendation.roadmap.difficulty,

    phases: recommendation.roadmap.phases.map((phase) => ({
      id: phase.id,
      title: phase.title,
      description: phase.description,
      order: phase.order,
      estimatedWeeks: phase.estimatedWeeks,

      resources: phase.resources.map((resource) => ({
        id: resource.id,
        title: resource.title,

        /*
         * Prisma returns these as string.
         * The application roadmap types define them
         * as specific union values.
         */
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

  /*
   * Now the object exactly matches what buildRoadmapView expects.
   */
  const roadmapView = buildRoadmapView(normalizedRoadmap);

  return (
    <Container className="max-w-4xl space-y-6 pb-12">
      <RoadmapHero
        roadmap={roadmapView}
        careerName={recommendation.careerTitle}
      />

      <RoadmapProgress roadmap={roadmapView} />

      <RoadmapTimeline roadmap={roadmapView} />
    </Container>
  );
}