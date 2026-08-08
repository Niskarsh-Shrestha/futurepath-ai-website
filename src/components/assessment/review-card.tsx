import Link from "next/link";
import { Pencil } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Typography } from "@/components/ui/typography";
import { ASSESSMENT_SECTIONS } from "@/lib/assessment/sections";
import { getQuestionsBySection } from "@/lib/assessment/assessment-engine";
import type { AnswerValue } from "@/components/assessment/question-card";

interface ReviewCardProps {
  sectionId: string;
  assessmentId: string;
  answers: Record<string, AnswerValue>;
}

function formatAnswer(value: AnswerValue): string {
  if (value === null || value === undefined || value === "") return "Not answered";
  if (Array.isArray(value)) return value.length > 0 ? value.join(", ") : "Not answered";
  return String(value);
}

export function ReviewCard({ sectionId, assessmentId, answers }: ReviewCardProps) {
  const section = ASSESSMENT_SECTIONS.find((s) => s.id === sectionId);
  const questions = getQuestionsBySection(sectionId);
  if (!section) return null;

  return (
    <Card className="rounded-2xl border border-border bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <Typography variant="title" as="h3" className="font-semibold text-foreground">
          {section.title}
        </Typography>
        <Button variant="outline" size="sm" leftIcon={<Pencil className="h-3.5 w-3.5" />} asChild>
          <Link href={`/dashboard/assessment/${assessmentId}?section=${sectionId}`}>Edit</Link>
        </Button>
      </div>

      <div className="mt-4 space-y-4 divide-y divide-border">
        {questions.map((question) => (
          <div key={question.id} className="pt-4 first:pt-0">
            <Typography variant="bodySmall" className="font-medium text-foreground">
              {question.label}
            </Typography>
            <Typography variant="bodySmall" className="mt-1 text-muted-foreground">
              {formatAnswer(answers[question.id] ?? null)}
            </Typography>
          </div>
        ))}
      </div>
    </Card>
  );
}