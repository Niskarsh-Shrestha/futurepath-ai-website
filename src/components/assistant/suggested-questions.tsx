"use client";

import { Typography } from "@/components/ui/typography";

const SUGGESTED_QUESTIONS = [
  "Why was Software Engineer recommended?",
  "What should my child learn next?",
  "Explain my child's strengths.",
  "How can my child improve communication skills?",
  "Which career suits my child best?",
];

interface SuggestedQuestionsProps {
  onSelect: (question: string) => void;
}

export function SuggestedQuestions({ onSelect }: SuggestedQuestionsProps) {
  return (
    <div>
      <Typography variant="caption" className="font-semibold uppercase tracking-wider text-muted-foreground">
        Suggested Questions
      </Typography>
      <div className="mt-2.5 flex flex-wrap gap-2">
        {SUGGESTED_QUESTIONS.map((question) => (
          <button
            key={question}
            type="button"
            onClick={() => onSelect(question)}
            className="rounded-full border border-border bg-secondary/50 px-3.5 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:border-primary/30 hover:bg-primary/10 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {question}
          </button>
        ))}
      </div>
    </div>
  );
}