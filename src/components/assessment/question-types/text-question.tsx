"use client";

import { Input } from "@/components/ui/input";
import type { AssessmentQuestion } from "@/lib/assessment/questions";

interface TextQuestionProps {
  question: AssessmentQuestion;
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export function TextQuestion({ question, value, onChange, error }: TextQuestionProps) {
  return (
    <Input
      value={value ?? ""}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Type your answer..."
      errorText={error}
      aria-label={question.label}
    />
  );
}