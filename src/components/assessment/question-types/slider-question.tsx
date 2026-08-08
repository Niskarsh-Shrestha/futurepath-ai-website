"use client";

import { Typography } from "@/components/ui/typography";
import type { AssessmentQuestion } from "@/lib/assessment/questions";

interface SliderQuestionProps {
  question: AssessmentQuestion;
  value: number;
  onChange: (value: number) => void;
  error?: string;
}

export function SliderQuestion({ question, value, onChange, error }: SliderQuestionProps) {
  const min = question.min ?? 0;
  const max = question.max ?? 100;
  const current = value ?? Math.round((min + max) / 2);

  return (
    <div className="space-y-3">
      <input
        type="range"
        min={min}
        max={max}
        value={current}
        onChange={(e) => onChange(Number(e.target.value))}
        aria-label={question.label}
        className="h-2 w-full cursor-pointer appearance-none rounded-full bg-secondary accent-primary"
      />
      <div className="flex items-center justify-between">
        <Typography variant="caption" className="text-muted-foreground">
          {question.minLabel ?? min}
        </Typography>
        <Typography variant="bodySmall" className="font-semibold text-primary">
          {current}
        </Typography>
        <Typography variant="caption" className="text-muted-foreground">
          {question.maxLabel ?? max}
        </Typography>
      </div>
      {error && (
        <p className="text-xs text-destructive" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}