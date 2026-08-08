import { getAiProvider } from "@/lib/ai/provider";
import { parseAiAnalysisResponse } from "@/lib/ai/parser";
import { withRetry, isRetryableError } from "@/lib/ai/retry";
import { AI_ANALYSIS_SYSTEM_PROMPT, PROMPT_VERSION } from "@/lib/ai/prompts";
import type { AiAnalysisResponse } from "@/lib/ai/types";

interface GenerateAnalysisResult {
  success: boolean;
  data?: AiAnalysisResponse;
  model?: string;
  promptVersion?: string;
  error?: string;
}

/**
 * Single entry point the rest of the app calls to get an AI analysis.
 * Handles provider call, JSON parsing/validation, and retry-on-transient-
 * failure — callers (server actions) never touch OpenAI or Zod directly.
 */
export async function generateAiAnalysis(userPrompt: string): Promise<GenerateAnalysisResult> {
  try {
    const result = await withRetry(async () => {
      const provider = getAiProvider();
      const { content, model } = await provider.generate(AI_ANALYSIS_SYSTEM_PROMPT, userPrompt);

      const parsed = parseAiAnalysisResponse(content);
      if (!parsed.success) {
        throw new Error(parsed.error ?? "Invalid AI response");
      }

      return { data: parsed.data as AiAnalysisResponse, model };
    });

    return { success: true, data: result.data, model: result.model, promptVersion: PROMPT_VERSION };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    const userMessage = isRetryableError(error)
      ? "The AI service is temporarily unavailable. Please try again in a moment."
      : "Something went wrong generating the analysis. Please try again.";

    console.error("[AI Analysis] Generation failed:", message);
    return { success: false, error: userMessage };
  }
}