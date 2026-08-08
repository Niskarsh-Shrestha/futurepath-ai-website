"use server";

import { z } from "zod";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { getAiProvider } from "@/lib/ai/provider";
import { buildRoadmapView } from "@/lib/roadmap/timeline";
import type {
  LearningResourceProvider,
  LearningResourceType,
} from "@/lib/roadmap/roadmap-types";

interface AskAssistantResult {
  success: boolean;
  answer?: string;
  error?: string;
}

const assistantResponseSchema = z.object({
  answer: z.string().min(1),
});

const ASSISTANT_SYSTEM_PROMPT = `You are a friendly, knowledgeable assistant for FuturePath AI, helping parents understand their child's assessment results, AI analysis, career recommendations, and learning roadmap.

Rules:

- Answer ONLY using the context provided below. Do not invent facts not implied by it.
- If the context doesn't contain enough information to answer, say so honestly rather than guessing.
- Keep answers concise and parent-friendly (2-5 sentences), no jargon.
- Respond with ONLY a single valid JSON object: { "answer": string }. No markdown, no commentary, no code fences.`;

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

interface ContextInput {
  childFirstName: string;
  childAge: number;

  analysis: {
    summary: string;
    strengths: string[];
    weaknesses: string[];
    learningStyleAnalysis: string;
    personalityAnalysis: string;
    careerInterestAnalysis: string;
    confidenceScore: number;
  } | null;

  recommendations: {
    careerTitle: string;
    matchScore: number;
    reasoning: string;
  }[];

  roadmapSummary: {
    title: string;
    overallProgress: number;
    currentPhaseTitle: string | null;
  } | null;
}

function buildContext(input: ContextInput): string {
  const parts: string[] = [
    `Child: ${input.childFirstName}, age ${input.childAge}`,
  ];

  if (input.analysis) {
    parts.push(
      [
        `AI Analysis Summary: ${input.analysis.summary}`,
        `Strengths: ${input.analysis.strengths.join(", ")}`,
        `Areas for Growth: ${input.analysis.weaknesses.join(", ")}`,
        `Learning Style: ${input.analysis.learningStyleAnalysis}`,
        `Personality: ${input.analysis.personalityAnalysis}`,
        `Career Interests: ${input.analysis.careerInterestAnalysis}`,
        `Confidence Score: ${input.analysis.confidenceScore}%`,
      ].join("\n"),
    );
  } else {
    parts.push("No AI analysis has been generated yet for this child.");
  }

  if (input.recommendations.length > 0) {
    const recText = input.recommendations
      .map(
        (r) =>
          `- ${r.careerTitle} (${r.matchScore}% match): ${r.reasoning}`,
      )
      .join("\n");

    parts.push(`Career Recommendations:\n${recText}`);
  } else {
    parts.push("No career recommendations have been generated yet.");
  }

  if (input.roadmapSummary) {
    parts.push(
      `Learning Roadmap: "${input.roadmapSummary.title}" — ${input.roadmapSummary.overallProgress}% complete. Current phase: ${input.roadmapSummary.currentPhaseTitle ?? "N/A"}.`,
    );
  } else {
    parts.push("No learning roadmap has been generated yet.");
  }

  return parts.join("\n\n");
}

/**
 * Normalizes Prisma's database strings into the stricter
 * roadmap view types used by the application.
 */
function normalizeRoadmap(
  roadmap: {
    id: string;
    recommendationId: string;
    title: string;
    description: string;
    estimatedDuration: string;
    difficulty: string;
    phases: {
      id: string;
      title: string;
      description: string;
      order: number;
      estimatedWeeks: number;
      resources: {
        id: string;
        title: string;
        type: string;
        provider: string;
        url: string;
        estimatedHours: number;
        isOptional: boolean;
        isFree: boolean;
        isCompleted: boolean;
      }[];
      milestones: {
        id: string;
        title: string;
        description: string;
        order: number;
        isCompleted: boolean;
      }[];
    }[];
  },
) {
  return {
    ...roadmap,

    phases: roadmap.phases.map((phase) => ({
      ...phase,

      resources: phase.resources.map((resource) => ({
        ...resource,
        type: resource.type as LearningResourceType,
        provider: resource.provider as LearningResourceProvider,
      })),
    })),
  };
}

/**
 * Answers one question about the parent's most recently updated child,
 * using their existing assessment/analysis/recommendations/roadmap as
 * context.
 *
 * Stateless by design — no conversation is saved, and every call is
 * independent.
 */
export async function askAssistant(
  question: string,
): Promise<AskAssistantResult> {
  const session = await auth();

  if (!session?.user?.id) {
    return {
      success: false,
      error: "Not authenticated",
    };
  }

  const trimmedQuestion = question.trim();

  if (!trimmedQuestion) {
    return {
      success: false,
      error: "Please enter a question",
    };
  }

  // Only retrieve children belonging to the authenticated user.
  const child = await db.child.findFirst({
    where: {
      userId: session.user.id,
    },

    orderBy: {
      updatedAt: "desc",
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
              recommendations: {
                orderBy: {
                  matchScore: "desc",
                },

                take: 5,

                include: {
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
              },
            },
          },
        },
      },
    },
  });

  if (!child) {
    return {
      success: false,
      error: "Add a child profile before using the AI Assistant",
    };
  }

  const analysis = child.assessments[0]?.aiAnalysis ?? null;

  const recommendations = analysis?.recommendations ?? [];

  const recommendationWithRoadmap =
    recommendations.find((recommendation) => recommendation.roadmap) ?? null;

  const roadmapSummary = recommendationWithRoadmap?.roadmap
    ? (() => {
        const normalizedRoadmap = normalizeRoadmap(
          recommendationWithRoadmap.roadmap,
        );

        const view = buildRoadmapView(normalizedRoadmap);

        return {
          title: view.title,
          overallProgress: view.overallProgress,
          currentPhaseTitle: view.currentPhase?.title ?? null,
        };
      })()
    : null;

  const context = buildContext({
    childFirstName: child.firstName,

    childAge: calculateAge(child.dateOfBirth),

    analysis: analysis
      ? {
          summary: analysis.summary,
          strengths: analysis.strengths,
          weaknesses: analysis.weaknesses,
          learningStyleAnalysis: analysis.learningStyleAnalysis,
          personalityAnalysis: analysis.personalityAnalysis,
          careerInterestAnalysis: analysis.careerInterestAnalysis,
          confidenceScore: analysis.confidenceScore,
        }
      : null,

    recommendations: recommendations.map((recommendation) => ({
      careerTitle: recommendation.careerTitle,
      matchScore: recommendation.matchScore,
      reasoning: recommendation.reasoning,
    })),

    roadmapSummary,
  });

  const userPrompt = `Context:\n${context}\n\nParent's question: ${trimmedQuestion}`;

  try {
    const provider = getAiProvider();

    const { content } = await provider.generate(
      ASSISTANT_SYSTEM_PROMPT,
      userPrompt,
    );

    const parsedJson = JSON.parse(content);

    const parsed = assistantResponseSchema.safeParse(parsedJson);

    if (!parsed.success) {
      return {
        success: false,
        error: "Received an unexpected response. Please try again.",
      };
    }

    return {
      success: true,
      answer: parsed.data.answer,
    };
  } catch (err) {
    console.error("[AI Assistant] Request failed:", err);

    return {
      success: false,
      error:
        "The AI Assistant is temporarily unavailable. Please try again in a moment.",
    };
  }
}