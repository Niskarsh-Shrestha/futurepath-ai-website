import { db } from "@/lib/db";
import { ASSESSMENT_SECTIONS } from "@/lib/assessment/sections";
import {
  getQuestionsBySection,
  getQuestionById,
} from "@/lib/assessment/assessment-engine";
import { buildRoadmapView } from "@/lib/roadmap/timeline";
import { getCareerById } from "@/lib/careers/career-data";
import { buildAdvantagesAndChallenges } from "@/lib/careers/recommendation-builder";
import type {
  ReportData,
  ReportKeyResponse,
  ReportSectionSummary,
} from "@/lib/reports/report-types";

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

function formatAnswer(value: unknown): string {
  if (value === null || value === undefined || value === "") {
    return "Not answered";
  }

  if (Array.isArray(value)) {
    return value.length > 0 ? value.join(", ") : "Not answered";
  }

  return String(value);
}

/**
 * Selects a handful of the most parent-legible answers.
 */
function selectKeyResponses(
  answers: { questionId: string; answer: unknown }[]
): ReportKeyResponse[] {
  const priorityQuestionIds = [
    "po-1",
    "po-8",
    "int-1",
    "acad-1",
    "ls-1",
    "cp-9",
  ];

  const answerMap = new Map(
    answers.map((answer) => [answer.questionId, answer.answer])
  );

  return priorityQuestionIds
    .map((questionId) => {
      const question = getQuestionById(questionId);
      const rawAnswer = answerMap.get(questionId);

      if (!question || rawAnswer === undefined) {
        return null;
      }

      const formatted = formatAnswer(rawAnswer);

      if (formatted === "Not answered") {
        return null;
      }

      return {
        question: question.label,
        answer: formatted,
      };
    })
    .filter((item): item is ReportKeyResponse => item !== null);
}

function buildNextSteps(
  skillGaps: { skill: string; priority: string }[],
  careerTitle: string,
  currentPhaseTitle: string | undefined
): ReportData["nextSteps"] {
  const highPriorityGaps = skillGaps
    .filter((gap) => gap.priority === "High")
    .slice(0, 3);

  const recommendationsForParents = [
    `Encourage exploration of ${careerTitle.toLowerCase()}-related activities and conversations at home.`,

    highPriorityGaps.length > 0
      ? `Focus support on developing: ${highPriorityGaps
          .map((gap) => gap.skill)
          .join(", ")}.`
      : "Continue reinforcing existing strengths through regular practice.",

    currentPhaseTitle
      ? `Support progress through the current roadmap phase: "${currentPhaseTitle}".`
      : "Consider generating a learning roadmap to give this recommendation a concrete next step.",
  ];

  const suggestedActivities = [
    "Discuss the assessment results together as a family.",
    `Look for local clubs, workshops, or programs related to ${careerTitle.toLowerCase()}.`,
    "Revisit this report every few months to track how interests and strengths evolve.",
  ];

  const resources = [
    {
      title: "Career Recommendations",
      url: "/dashboard/careers",
    },
    {
      title: "Learning Roadmap",
      url: "/dashboard/roadmap",
    },
  ];

  return {
    recommendationsForParents,
    suggestedActivities,
    resources,
  };
}

interface BuildReportDataResult {
  data: ReportData | null;
  ownerId: string | null;
}

/**
 * Converts the Prisma roadmap resource type into the type expected
 * by the roadmap timeline builder.
 *
 * Prisma currently returns `type` as a string, while
 * buildRoadmapView expects the application's LearningResourceType.
 */
function normalizeRoadmap(roadmap: any) {
  return {
    ...roadmap,
    phases: roadmap.phases.map((phase: any) => ({
      ...phase,
      resources: phase.resources.map((resource: any) => ({
        ...resource,
        type: resource.type as Parameters<
          typeof buildRoadmapView
        >[0]["phases"][number]["resources"][number]["type"],
      })),
    })),
  };
}

/**
 * Aggregates every piece of previously-generated data for a
 * CareerRecommendation into one ReportData object.
 *
 * Ownership is intentionally not checked here.
 * The calling server action is responsible for authorization.
 */
export async function buildReportData(
  recommendationId: string
): Promise<BuildReportDataResult> {
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

      analysis: {
        include: {
          careerMatches: {
            orderBy: {
              score: "desc",
            },
          },

          assessment: {
            include: {
              child: true,
              answers: true,
            },
          },
        },
      },
    },
  });

  if (!recommendation) {
    return {
      data: null,
      ownerId: null,
    };
  }

  const { analysis } = recommendation;
  const { assessment } = analysis;
  const { child } = assessment;

  /*
   * Assessment summary:
   * Per-section completion + selected key responses.
   */
  const completedSections: ReportSectionSummary[] =
    ASSESSMENT_SECTIONS.map((section) => {
      const questions = getQuestionsBySection(section.id);

      const answeredIds = new Set(
        assessment.answers.map((answer) => answer.questionId)
      );

      const answered = questions.filter((question) =>
        answeredIds.has(question.id)
      ).length;

      return {
        sectionTitle: section.title,
        answered,
        total: questions.length,
      };
    });

  const keyResponses = selectKeyResponses(assessment.answers);

  /*
   * All career recommendations for this analysis.
   */
  const allRecommendations = await db.careerRecommendation.findMany({
    where: {
      analysisId: analysis.id,
    },

    orderBy: {
      matchScore: "desc",
    },
  });

  const topRecommendations = allRecommendations.map((item) => ({
    careerTitle: item.careerTitle,
    matchScore: item.matchScore,
    reasoning: item.reasoning,
    salaryRange: item.salaryRange,
    futureDemand: item.futureDemand,
    educationLevel: item.educationLevel,
    isSelected: item.id === recommendation.id,
  }));

  /*
   * Selected career's advantages/challenges.
   */
  const staticRecord = getCareerById(
    recommendation.careerTitle
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
  );

  const { advantages, challenges } = staticRecord
    ? buildAdvantagesAndChallenges(staticRecord)
    : {
        advantages: [],
        challenges: [],
      };

  /*
   * Normalize the Prisma roadmap before passing it to
   * buildRoadmapView().
   */
  const normalizedRoadmap = normalizeRoadmap(recommendation.roadmap);

const roadmapView = recommendation.roadmap
  ? buildRoadmapView(normalizeRoadmap(recommendation.roadmap))
  : null;

  const nextSteps = buildNextSteps(
    recommendation.skillGaps,
    recommendation.careerTitle,
    roadmapView?.currentPhase?.title
  );

  const data: ReportData = {
    recommendationId: recommendation.id,

    child: {
      firstName: child.firstName,
      lastName: child.lastName,
      age: calculateAge(child.dateOfBirth),
    },

    generatedAt: new Date(),

    topCareerMatch: recommendation.careerTitle,

    confidenceScore: analysis.confidenceScore,

    assessment: {
      completedSections,
      keyResponses,
      overallSummary: analysis.summary,
    },

    aiAnalysis: {
      strengths: analysis.strengths,
      weaknesses: analysis.weaknesses,
      learningStyleAnalysis: analysis.learningStyleAnalysis,
      personalityAnalysis: analysis.personalityAnalysis,
      careerInterestAnalysis: analysis.careerInterestAnalysis,
      confidenceScore: analysis.confidenceScore,
      analysisDate: analysis.createdAt,
    },

    topRecommendations,

    selectedCareer: {
      careerTitle: recommendation.careerTitle,
      careerCategory: recommendation.careerCategory,
      description: recommendation.description,
      matchScore: recommendation.matchScore,

      advantages,
      challenges,

      skillGaps: recommendation.skillGaps.map((gap) => ({
        skill: gap.skill,
        currentLevel: gap.currentLevel,
        requiredLevel: gap.requiredLevel,
        priority: gap.priority,
      })),

      careerPath: recommendation.careerPath.map((path) => ({
        step: path.step,
        title: path.title,
        description: path.description,
      })),
    },

    roadmap: roadmapView,

    nextSteps,
  };

  return {
    data,
    ownerId: child.userId,
  };
}