"use client";

import { motion } from "framer-motion";
import { Check, Loader2 } from "lucide-react";
import { Typography } from "@/components/ui/typography";

export type SaveStatus = "saved" | "saving" | "unsaved";

interface AssessmentProgressProps {
  percent: number;
  saveStatus: SaveStatus;
}

const SAVE_STATUS_CONFIG: Record<SaveStatus, { label: string; icon: React.ReactNode; className: string }> = {
  saved: { label: "Saved", icon: <Check className="h-3.5 w-3.5" />, className: "text-success" },
  saving: { label: "Saving...", icon: <Loader2 className="h-3.5 w-3.5 animate-spin" />, className: "text-muted-foreground" },
  unsaved: { label: "Unsaved changes", icon: null, className: "text-warning" },
};

export function AssessmentProgress({ percent, saveStatus }: AssessmentProgressProps) {
  const status = SAVE_STATUS_CONFIG[saveStatus];

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Typography variant="bodySmall" className="font-medium text-foreground">
          {percent}% complete
        </Typography>
        <span className={`flex items-center gap-1.5 text-xs font-medium ${status.className}`}>
          {status.icon}
          {status.label}
        </span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-secondary">
        <motion.div
          className="h-full rounded-full bg-primary"
          initial={false}
          animate={{ width: `${percent}%` }}
          transition={{ duration: 0.4 }}
        />
      </div>
    </div>
  );
}