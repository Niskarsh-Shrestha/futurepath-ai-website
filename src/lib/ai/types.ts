import { z } from "zod";

export const careerMatchSchema = z.object({
  career: z.string().min(1),
  score: z.number().int().min(0).max(100),
  reason: z.string().min(1),
});

export const aiAnalysisResponseSchema = z.object({
  summary: z.string().min(1),
  strengths: z.array(z.string().min(1)).min(1),
  weaknesses: z.array(z.string().min(1)).min(1),
  learningStyleAnalysis: z.string().min(1),
  personalityAnalysis: z.string().min(1),
  careerInterestAnalysis: z.string().min(1),
  confidenceScore: z.number().int().min(0).max(100),
  careerMatches: z.array(careerMatchSchema).min(3).max(8),
});

export type AiAnalysisResponse = z.infer<typeof aiAnalysisResponseSchema>;
export type CareerMatchResponse = z.infer<typeof careerMatchSchema>;

export interface AssessmentAnswerForAi {
  questionLabel: string;
  sectionTitle: string;
  answer: string;
}

export interface AiProviderResult {
  content: string;
  model: string;
}

export interface AiProvider {
  generate(systemPrompt: string, userPrompt: string): Promise<AiProviderResult>;
}