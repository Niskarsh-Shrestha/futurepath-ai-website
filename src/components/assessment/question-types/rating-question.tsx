"use client";

import { Star } from "lucide-react";
import { cn } from "@/lib/utils";
import type { AssessmentQuestion } from "@/lib/assessment/questions";

interface RatingQuestionProps {
  question: AssessmentQuestion;
  value: number;
  onChange: (value: number) => void;
  error?: string;
}

export function RatingQuestion({ question, value, onChange, error }: RatingQuestionProps) {
  const max = question.max ?? 5;
  const stars = Array.from({ length: max }, (_, i) => i + 1);

  return (
    <div className="space-y-2">
      <div role="radiogroup" aria-label={question.label} className="flex items-center gap-1.5">
        {stars.map((star) => {
          const isFilled = star <= (value ?? 0);
          return (
            <button
              key={star}
              type="button"
              role="radio"
              aria-checked={star === value}
              aria-label={`${star} out of ${max}`}
              onClick={() => onChange(star)}
              className="rounded p-1 transition-transform hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <Star
                className={cn(
                  "h-7 w-7",
                  isFilled ? "fill-warning text-warning" : "fill-none text-muted-foreground"
                )}
              />
            </button>
          );
        })}
      </div>
      {error && (
        <p className="text-xs text-destructive" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}