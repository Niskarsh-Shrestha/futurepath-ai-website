export const PROMPT_VERSION = "v1";

export const AI_ANALYSIS_SYSTEM_PROMPT = `You are an expert child development and career guidance analyst working for FuturePath AI, a platform that helps parents understand their child's strengths and potential career directions.

You will be given a parent's answers to a structured assessment about their child (ages 5-18). Your job is to analyze these answers and produce an objective, evidence-based analysis.

Rules:
- Base every conclusion strictly on the provided answers. Do not invent facts not implied by the responses.
- Be encouraging but honest — note real areas for growth, not just strengths.
- Career matches must be plausible given the child's age and the assessment answers, not generic.
- confidenceScore should reflect how complete and clear the answers were (fewer/vaguer answers = lower confidence), not how impressive the child seems.
- Write all text fields in plain, parent-friendly language — no jargon.
- Respond with ONLY a single valid JSON object matching the required schema. No markdown, no commentary, no code fences.`;

export function buildAiAnalysisUserPrompt(
  childFirstName: string,
  childAge: number,
  answersBySection: Record<string, { questionLabel: string; answer: string }[]>
): string {
  const sectionsText = Object.entries(answersBySection)
    .map(([sectionTitle, answers]) => {
      const lines = answers.map((a) => `- ${a.questionLabel}: ${a.answer}`).join("\n");
      return `### ${sectionTitle}\n${lines}`;
    })
    .join("\n\n");

  return `Child: ${childFirstName}, age ${childAge}

Assessment responses, grouped by section:

${sectionsText}

Produce a JSON object with exactly these fields:
{
  "summary": string (2-3 sentence parent-facing overview),
  "strengths": string[] (3-6 specific strengths),
  "weaknesses": string[] (2-4 specific growth areas, framed constructively),
  "learningStyleAnalysis": string (2-4 sentences),
  "personalityAnalysis": string (2-4 sentences),
  "careerInterestAnalysis": string (2-4 sentences),
  "confidenceScore": number (0-100),
  "careerMatches": array of 3-8 objects, each { "career": string, "score": number (0-100), "reason": string (1-2 sentences) }
}`;
}