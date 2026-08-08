"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Typography } from "@/components/ui/typography";
import type { AssessmentQuestion } from "@/lib/assessment/questions";

interface CheckboxQuestionProps {
  question: AssessmentQuestion;
  value: string[];
  onChange: (value: string[]) => void;
  error?: string;
}

export function CheckboxQuestion({ question, value, onChange, error }: CheckboxQuestionProps) {
  const selected = value ?? [];

  function toggle(option: string) {
    if (selected.includes(option)) {
      onChange(selected.filter((v) => v !== option));
    } else {
      onChange([...selected, option]);
    }
  }

  return (
    <div role="group" aria-label={question.label} className="space-y-2">
      {(question.options ?? []).map((option) => {
        const id = `${question.id}-${option}`;
        return (
          <label
            key={option}
            htmlFor={id}
            className="flex cursor-pointer items-center gap-3 rounded-xl border border-border bg-white px-4 py-3 text-sm transition-colors hover:bg-secondary/50"
          >
            <Checkbox id={id} checked={selected.includes(option)} onCheckedChange={() => toggle(option)} />
            <Typography variant="bodySmall" className="text-foreground">
              {option}
            </Typography>
          </label>
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