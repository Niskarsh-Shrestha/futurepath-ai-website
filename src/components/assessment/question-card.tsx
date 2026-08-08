"use client";

import { motion } from "framer-motion";
import { Typography } from "@/components/ui/typography";
import { TextQuestion } from "@/components/assessment/question-types/text-question";
import { TextareaQuestion } from "@/components/assessment/question-types/textarea-question";
import { RadioQuestion } from "@/components/assessment/question-types/radio-question";
import { CheckboxQuestion } from "@/components/assessment/question-types/checkbox-question";
import { SelectQuestion } from "@/components/assessment/question-types/select-question";
import { SliderQuestion } from "@/components/assessment/question-types/slider-question";
import { LikertQuestion } from "@/components/assessment/question-types/likert-question";
import { RatingQuestion } from "@/components/assessment/question-types/rating-question";
import { YesNoQuestion } from "@/components/assessment/question-types/yes-no-question";
import type { AssessmentQuestion } from "@/lib/assessment/questions";

export type AnswerValue = string | string[] | number | null;

interface QuestionCardProps {
  question: AssessmentQuestion;
  index: number;
  value: AnswerValue;
  onChange: (value: AnswerValue) => void;
  error?: string;
}

export function QuestionCard({ question, index, value, onChange, error }: QuestionCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.03 }}
      className="rounded-2xl border border-border bg-white p-6 shadow-sm"
    >
      <div className="mb-4">
        <Typography variant="bodySmall" className="font-medium text-foreground">
          {question.label}
          {question.required && <span className="ml-1 text-destructive">*</span>}
        </Typography>
        {question.description && (
          <Typography variant="caption" className="mt-1 block text-muted-foreground">
            {question.description}
          </Typography>
        )}
      </div>

      {renderQuestionInput(question, value, onChange, error)}
    </motion.div>
  );
}

function renderQuestionInput(
  question: AssessmentQuestion,
  value: AnswerValue,
  onChange: (value: AnswerValue) => void,
  error?: string
) {
  switch (question.type) {
    case "short_text":
      return <TextQuestion question={question} value={(value as string) ?? ""} onChange={onChange} error={error} />;
    case "long_text":
      return <TextareaQuestion question={question} value={(value as string) ?? ""} onChange={onChange} error={error} />;
    case "single_choice":
      return <RadioQuestion question={question} value={(value as string) ?? ""} onChange={onChange} error={error} />;
    case "multiple_choice":
      return <CheckboxQuestion question={question} value={(value as string[]) ?? []} onChange={onChange} error={error} />;
    case "dropdown":
      return <SelectQuestion question={question} value={(value as string) ?? ""} onChange={onChange} error={error} />;
    case "slider":
      return <SliderQuestion question={question} value={value as number} onChange={onChange} error={error} />;
    case "likert":
      return <LikertQuestion question={question} value={value as number} onChange={onChange} error={error} />;
    case "rating":
      return <RatingQuestion question={question} value={value as number} onChange={onChange} error={error} />;
    case "yes_no":
      return <YesNoQuestion question={question} value={(value as string) ?? ""} onChange={onChange} error={error} />;
    default:
      return null;
  }
}