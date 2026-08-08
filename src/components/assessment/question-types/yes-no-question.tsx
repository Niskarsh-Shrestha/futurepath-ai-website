"use client";

import { cn } from "@/lib/utils";
import type { AssessmentQuestion } from "@/lib/assessment/questions";

interface YesNoQuestionProps {
  question: AssessmentQuestion;
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export function YesNoQuestion({ question, value, onChange, error }: YesNoQuestionProps) {
  return (
    <div className="space-y-2">
      <div role="radiogroup" aria-label={question.label} className="flex gap-3">
        {["Yes", "No"].map((option) => {
          const isSelected = value === option;
          return (
            <button
              key={option}
              type="button"
              role="radio"
              aria-checked={isSelected}
              onClick={() => onChange(option)}
              className={cn(
                "flex-1 rounded-xl border px-4 py-3 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                isSelected
                  ? "border-primary bg-primary text-white"
                  : "border-border bg-white text-muted-foreground hover:bg-secondary/50"
              )}
            >
              {option}
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