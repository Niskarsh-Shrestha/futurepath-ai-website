import { z } from "zod";
import type { QuestionType } from "@/lib/assessment/questions";

// Answer shape varies by question type — validated dynamically against
// the specific question's type at save-time (see save-answer action),
// not as one fixed static schema.
export const answerValueSchema = z.union([
  z.string(),
  z.array(z.string()),
  z.number(),
  z.null(),
]);

export const saveAnswerSchema = z.object({
  assessmentId: z.string().min(1),
  questionId: z.string().min(1),
  answer: answerValueSchema,
  notes: z.string().max(500).optional(),
});

export type SaveAnswerInput = z.infer<typeof saveAnswerSchema>;

/**
 * Validates a raw answer value against its question's expected type.
 * Returns an error message if invalid, or null if valid.
 */
export function validateAnswerForType(
  type: QuestionType,
  value: unknown,
  required: boolean
): string | null {
  const isEmpty =
    value === null ||
    value === undefined ||
    value === "" ||
    (Array.isArray(value) && value.length === 0);

  if (required && isEmpty) return "This question requires an answer";
  if (isEmpty) return null;

  switch (type) {
    case "short_text":
    case "long_text":
    case "single_choice":
    case "dropdown":
    case "yes_no":
      return typeof value === "string" ? null : "Invalid answer format";
    case "multiple_choice":
      return Array.isArray(value) ? null : "Invalid answer format";
    case "likert":
    case "rating":
    case "slider":
      return typeof value === "number" ? null : "Invalid answer format";
    default:
      return null;
  }
}