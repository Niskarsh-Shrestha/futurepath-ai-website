import { aiAnalysisResponseSchema, type AiAnalysisResponse } from "@/lib/ai/types";

interface ParseResult {
  success: boolean;
  data?: AiAnalysisResponse;
  error?: string;
}

export function parseAiAnalysisResponse(rawContent: string): ParseResult {
  let json: unknown;

  try {
    json = JSON.parse(rawContent);
  } catch {
    return { success: false, error: "AI response was not valid JSON" };
  }

  const result = aiAnalysisResponseSchema.safeParse(json);
  if (!result.success) {
    const issues = result.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join("; ");
    return { success: false, error: `AI response did not match expected schema: ${issues}` };
  }

  return { success: true, data: result.data };
}