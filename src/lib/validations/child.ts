import { z } from "zod";

const LEARNING_STYLES = ["Visual", "Auditory", "Reading/Writing", "Kinesthetic", "Mixed"] as const;
const GENDERS = ["Male", "Female", "Other", "Prefer not to say"] as const;

export const childSchema = z.object({
  firstName: z.string().min(1, "First name is required").max(50),
  lastName: z.string().min(1, "Last name is required").max(50),
  dateOfBirth: z
    .string()
    .min(1, "Date of birth is required")
    .refine((val) => !Number.isNaN(Date.parse(val)), "Enter a valid date")
    .refine((val) => new Date(val) <= new Date(), "Date of birth cannot be in the future"),
  gender: z.enum(GENDERS).optional(),
  school: z.string().max(100).optional().or(z.literal("")),
  grade: z.string().max(30).optional().or(z.literal("")),
  country: z.string().max(56).optional().or(z.literal("")),
  learningStyle: z.enum(LEARNING_STYLES).optional(),
  interests: z.array(z.string().min(1).max(40)).max(20, "Maximum 20 interests"),
  strengths: z.array(z.string().min(1).max(40)).max(20, "Maximum 20 strengths"),
});

export type ChildInput = z.infer<typeof childSchema>;
export { LEARNING_STYLES, GENDERS };