import { CAREER_DATA, type CareerRecord } from "@/lib/careers/career-data";

export interface AnalysisSignals {
  strengths: string[];
  weaknesses: string[];
  personalityAnalysis: string;
  learningStyleAnalysis: string;
  careerInterestAnalysis: string;
  /** Career titles + scores already suggested by the AI analysis (Task 8) */
  aiCareerMatches: { career: string; score: number }[];
}

interface ScoredCareer {
  career: CareerRecord;
  score: number;
  matchedSignals: string[];
}

const STOP_WORDS = new Set(["the", "a", "an", "and", "or", "of", "to", "in", "with", "for", "is", "are"]);

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 2 && !STOP_WORDS.has(w));
}

/**
 * Scores every career in the static dataset against the AI analysis's
 * signals (strengths, personality/interest text, and the AI's own
 * career suggestions from Task 8) using simple, explainable keyword
 * overlap — no second AI call needed, since the AI analysis has already
 * done the interpretive work; this engine just matches it against the
 * structured dataset.
 */
export function scoreCareersAgainstAnalysis(signals: AnalysisSignals): ScoredCareer[] {
  const strengthTokens = new Set(signals.strengths.flatMap(tokenize));
  const interestTokens = new Set([
    ...tokenize(signals.careerInterestAnalysis),
    ...tokenize(signals.personalityAnalysis),
    ...tokenize(signals.learningStyleAnalysis),
  ]);

  const aiMatchByTitle = new Map(
    signals.aiCareerMatches.map((m) => [m.career.toLowerCase(), m.score])
  );

  return CAREER_DATA.map((career) => {
    const matchedSignals: string[] = [];
    let score = 30; // baseline so every career has a non-zero starting point

    // Direct AI suggestion carries the most weight — the AI already
    // reasoned about this specific career for this specific child.
    const directAiScore = aiMatchByTitle.get(career.name.toLowerCase());
    if (directAiScore !== undefined) {
      score += directAiScore * 0.5;
      matchedSignals.push("Directly suggested by AI analysis");
    }

    // Skill/keyword overlap with strengths
    const careerSkillTokens = new Set(career.skills.flatMap(tokenize));
    const strengthOverlap = [...careerSkillTokens].filter((t) => strengthTokens.has(t));
    if (strengthOverlap.length > 0) {
      score += Math.min(strengthOverlap.length * 8, 24);
      matchedSignals.push("Aligned with your child's strengths");
    }

    // Personality/interest overlap
    const personalityTokens = new Set(career.typicalPersonality.flatMap(tokenize));
    const personalityOverlap = [...personalityTokens].filter((t) => interestTokens.has(t));
    if (personalityOverlap.length > 0) {
      score += Math.min(personalityOverlap.length * 6, 18);
      matchedSignals.push("Matches personality and interest profile");
    }

    return { career, score: Math.min(Math.round(score), 100), matchedSignals };
  }).sort((a, b) => b.score - a.score);
}

export function getTopCareerMatches(signals: AnalysisSignals, count = 5): ScoredCareer[] {
  return scoreCareersAgainstAnalysis(signals).slice(0, count);
}

export function getEducationLevelRank(level: string): number {
  const ranks: Record<string, number> = {
    "Not required": 0,
    "Trade Certification": 1,
    "Associate Degree": 2,
    "Bachelor's Degree": 3,
    "Master's Degree": 4,
    Doctorate: 5,
  };
  return ranks[level] ?? 3;
}