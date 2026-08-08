"use client";

import { Textarea } from "@/components/ui/textarea";
import type { AssessmentQuestion } from "@/lib/assessment/questions";

interface TextareaQuestionProps {
  question: AssessmentQuestion;
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export function TextareaQuestion({ question, value, onChange, error }: TextareaQuestionProps) {
  return (
    <Textarea
      value={value ?? ""}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Type your answer..."
      errorText={error}
      rows={4}
      aria-label={question.label}
    />
  );
}