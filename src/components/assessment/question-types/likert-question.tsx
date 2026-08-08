"use client";

import { cn } from "@/lib/utils";
import { Typography } from "@/components/ui/typography";
import type { AssessmentQuestion } from "@/lib/assessment/questions";

interface LikertQuestionProps {
  question: AssessmentQuestion;
  value: number;
  onChange: (value: number) => void;
  error?: string;
}

export function LikertQuestion({ question, value, onChange, error }: LikertQuestionProps) {
  const min = question.min ?? 1;
  const max = question.max ?? 5;
  const points = Array.from({ length: max - min + 1 }, (_, i) => min + i);

  return (
    <div className="space-y-2">
      <div role="radiogroup" aria-label={question.label} className="flex items-center justify-between gap-2">
        {points.map((point) => {
          const isSelected = value === point;
          return (
            <button
              key={point}
              type="button"
              role="radio"
              aria-checked={isSelected}
              onClick={() => onChange(point)}
              className={cn(
                "flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2 text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                isSelected
                  ? "border-primary bg-primary text-white scale-110"
                  : "border-border bg-white text-muted-foreground hover:border-primary/40"
              )}
            >
              {point}
            </button>
          );
        })}
      </div>
      <div className="flex items-center justify-between">
        <Typography variant="caption" className="text-muted-foreground">
          {question.minLabel}
        </Typography>
        <Typography variant="caption" className="text-muted-foreground">
          {question.maxLabel}
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