import type { LucideIcon } from "lucide-react";
import {
  UserCircle,
  Brain,
  Sparkles,
  BookOpen,
  Lightbulb,
  Users,
  Briefcase,
  Heart,
} from "lucide-react";
import { ASSESSMENT_QUESTIONS } from "@/lib/assessment/questions";

export interface AssessmentSectionMeta {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  order: number;
}

export const ASSESSMENT_SECTIONS: AssessmentSectionMeta[] = [
  { id: "personal-info", title: "Personal Information", description: "General context about your child's daily life.", icon: UserCircle, order: 1 },
  { id: "personality", title: "Personality", description: "How your child tends to think, feel, and behave.", icon: Brain, order: 2 },
  { id: "interests", title: "Interests", description: "What your child enjoys and gravitates toward.", icon: Sparkles, order: 3 },
  { id: "academic", title: "Academic Strengths", description: "Subject strengths and academic performance.", icon: BookOpen, order: 4 },
  { id: "learning-style", title: "Learning Style", description: "How your child learns and focuses best.", icon: Lightbulb, order: 5 },
  { id: "soft-skills", title: "Soft Skills", description: "Communication, teamwork, and problem solving.", icon: Users, order: 6 },
  { id: "career-preferences", title: "Career Preferences", description: "Early signals about future direction.", icon: Briefcase, order: 7 },
  { id: "parent-observations", title: "Parent Observations", description: "Your own insights as a parent.", icon: Heart, order: 8 },
];

export function getSectionQuestionCount(sectionId: string): number {
  return ASSESSMENT_QUESTIONS.filter((q) => q.sectionId === sectionId).length;
}

export const TOTAL_QUESTION_COUNT = ASSESSMENT_QUESTIONS.length;