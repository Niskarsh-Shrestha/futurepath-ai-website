"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import type { AssessmentQuestion } from "@/lib/assessment/questions";

interface RadioQuestionProps {
  question: AssessmentQuestion;
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export function RadioQuestion({ question, value, onChange, error }: RadioQuestionProps) {
  return (
    <div role="radiogroup" aria-label={question.label} className="space-y-2">
      {(question.options ?? []).map((option) => {
        const isSelected = value === option;
        return (
          <button
            key={option}
            type="button"
            role="radio"
            aria-checked={isSelected}
            onClick={() => onChange(option)}
            className={cn(
              "flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              isSelected
                ? "border-primary bg-primary/5 font-medium text-foreground"
                : "border-border bg-white text-muted-foreground hover:bg-secondary/50"
            )}
          >
            <span
              className={cn(
                "flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-full border-2",
                isSelected ? "border-primary bg-primary" : "border-input"
              )}
            >
              {isSelected && <Check className="h-2.5 w-2.5 text-white" />}
            </span>
            {option}
          </button>
        );
      })}
      {error && (
        <p className="text-xs text-destructive" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}