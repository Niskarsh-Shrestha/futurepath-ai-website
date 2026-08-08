import type { LucideIcon } from "lucide-react";
import { FileQuestion, CheckCircle2, Clock } from "lucide-react";
import type { AssessmentStatus } from "@prisma/client";

interface StatusDisplayInfo {
  label: string;
  icon: LucideIcon;
  badgeVariant: "subtle" | "warning" | "success" | "primary";
}

export const STATUS_DISPLAY: Record<AssessmentStatus, StatusDisplayInfo> = {
  DRAFT: { label: "Not Started", icon: FileQuestion, badgeVariant: "subtle" },
  IN_PROGRESS: { label: "In Progress", icon: Clock, badgeVariant: "warning" },
  COMPLETED: { label: "Ready to Submit", icon: CheckCircle2, badgeVariant: "primary" },
  SUBMITTED: { label: "Submitted", icon: CheckCircle2, badgeVariant: "success" },
};