import { ASSESSMENT_SECTIONS, type AssessmentSectionMeta } from "@/lib/assessment/sections";
import { ASSESSMENT_QUESTIONS, type AssessmentQuestion } from "@/lib/assessment/questions";

export function getSectionById(sectionId: string): AssessmentSectionMeta | undefined {
  return ASSESSMENT_SECTIONS.find((s) => s.id === sectionId);
}

export function getQuestionsBySection(sectionId: string): AssessmentQuestion[] {
  return ASSESSMENT_QUESTIONS.filter((q) => q.sectionId === sectionId);
}

export function getQuestionById(questionId: string): AssessmentQuestion | undefined {
  return ASSESSMENT_QUESTIONS.find((q) => q.id === questionId);
}

export function getNextSectionId(currentSectionId: string): string | null {
  const current = getSectionById(currentSectionId);
  if (!current) return null;
  const next = ASSESSMENT_SECTIONS.find((s) => s.order === current.order + 1);
  return next?.id ?? null;
}

export function getPreviousSectionId(currentSectionId: string): string | null {
  const current = getSectionById(currentSectionId);
  if (!current) return null;
  const prev = ASSESSMENT_SECTIONS.find((s) => s.order === current.order - 1);
  return prev?.id ?? null;
}

export function isLastSection(sectionId: string): boolean {
  const section = getSectionById(sectionId);
  if (!section) return false;
  return section.order === ASSESSMENT_SECTIONS.length;
}

/**
 * Computes overall progress (0-100) from a map of answered question IDs.
 * Only counts REQUIRED questions toward completion — optional questions
 * can be skipped without blocking 100%.
 */
export function calculateProgress(answeredQuestionIds: Set<string>): number {
  const requiredQuestions = ASSESSMENT_QUESTIONS.filter((q) => q.required);
  if (requiredQuestions.length === 0) return 100;
  const answeredRequired = requiredQuestions.filter((q) => answeredQuestionIds.has(q.id)).length;
  return Math.round((answeredRequired / requiredQuestions.length) * 100);
}

export function getSectionProgress(
  sectionId: string,
  answeredQuestionIds: Set<string>
): { answered: number; total: number; percent: number } {
  const questions = getQuestionsBySection(sectionId);
  const total = questions.length;
  const answered = questions.filter((q) => answeredQuestionIds.has(q.id)).length;
  return { answered, total, percent: total === 0 ? 0 : Math.round((answered / total) * 100) };
}

export function isSectionComplete(sectionId: string, answeredQuestionIds: Set<string>): boolean {
  const requiredInSection = getQuestionsBySection(sectionId).filter((q) => q.required);
  return requiredInSection.every((q) => answeredQuestionIds.has(q.id));
}