"use client";

import type { AssessmentQuestion } from "@/lib/assessment/questions";

interface SelectQuestionProps {
  question: AssessmentQuestion;
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export function SelectQuestion({ question, value, onChange, error }: SelectQuestionProps) {
  return (
    <div className="space-y-1.5">
      <select
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        aria-label={question.label}
        className="flex h-10 w-full rounded-lg border border-input bg-white px-3 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <option value="">Select an option</option>
        {(question.options ?? []).map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      {error && (
        <p className="text-xs text-destructive" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}