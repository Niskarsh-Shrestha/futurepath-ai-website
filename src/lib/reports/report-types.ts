import type { RoadmapView } from "@/lib/roadmap/roadmap-types";

export interface ReportChildInfo {
  firstName: string;
  lastName: string;
  age: number;
}

export interface ReportSectionSummary {
  sectionTitle: string;
  answered: number;
  total: number;
}

export interface ReportKeyResponse {
  question: string;
  answer: string;
}

export interface ReportAssessmentSummary {
  completedSections: ReportSectionSummary[];
  keyResponses: ReportKeyResponse[];
  overallSummary: string;
}

export interface ReportAiAnalysis {
  strengths: string[];
  weaknesses: string[];
  learningStyleAnalysis: string;
  personalityAnalysis: string;
  careerInterestAnalysis: string;
  confidenceScore: number;
  analysisDate: Date;
}

export interface ReportCareerRecommendationSummary {
  careerTitle: string;
  matchScore: number;
  reasoning: string;
  salaryRange: string;
  futureDemand: string;
  educationLevel: string;
  isSelected: boolean;
}

export interface ReportSkillGap {
  skill: string;
  currentLevel: number;
  requiredLevel: number;
  priority: string;
}

export interface ReportCareerPathStep {
  step: number;
  title: string;
  description: string;
}

export interface ReportSelectedCareer {
  careerTitle: string;
  careerCategory: string;
  description: string;
  matchScore: number;
  advantages: string[];
  challenges: string[];
  skillGaps: ReportSkillGap[];
  careerPath: ReportCareerPathStep[];
}

export interface ReportNextSteps {
  recommendationsForParents: string[];
  suggestedActivities: string[];
  resources: { title: string; url: string }[];
}

export interface ReportData {
  recommendationId: string;
  child: ReportChildInfo;
  generatedAt: Date;
  topCareerMatch: string;
  confidenceScore: number;
  assessment: ReportAssessmentSummary;
  aiAnalysis: ReportAiAnalysis;
  topRecommendations: ReportCareerRecommendationSummary[];
  selectedCareer: ReportSelectedCareer;
  roadmap: RoadmapView | null;
  nextSteps: ReportNextSteps;
}