"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Typography } from "@/components/ui/typography";
import { ASSESSMENT_SECTIONS } from "@/lib/assessment/sections";

interface AssessmentSidebarProps {
  activeSectionId: string;
  sectionCompletion: Record<string, { answered: number; total: number; complete: boolean }>;
  onSelectSection: (sectionId: string) => void;
}

export function AssessmentSidebar({ activeSectionId, sectionCompletion, onSelectSection }: AssessmentSidebarProps) {
  return (
    <nav aria-label="Assessment sections" className="hidden w-72 shrink-0 lg:block">
      <div className="sticky top-24 space-y-1">
        {ASSESSMENT_SECTIONS.map((section) => {
          const isActive = section.id === activeSectionId;
          const completion = sectionCompletion[section.id];

          return (
            <button
              key={section.id}
              type="button"
              onClick={() => onSelectSection(section.id)}
              aria-current={isActive ? "step" : undefined}
              className={cn(
                "flex w-full items-center gap-3 rounded-xl px-3.5 py-3 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                isActive ? "bg-primary/10" : "hover:bg-secondary"
              )}
            >
              <span
                className={cn(
                  "flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold",
                  completion?.complete
                    ? "bg-success text-white"
                    : isActive
                      ? "bg-primary text-white"
                      : "bg-secondary text-muted-foreground"
                )}
              >
                {completion?.complete ? <Check className="h-3.5 w-3.5" /> : section.order}
              </span>
              <div className="min-w-0 flex-1">
                <Typography
                  variant="bodySmall"
                  className={cn("truncate font-medium", isActive ? "text-primary" : "text-foreground")}
                >
                  {section.title}
                </Typography>
                {completion && (
                  <Typography variant="caption" className="text-muted-foreground">
                    {completion.answered}/{completion.total} answered
                  </Typography>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </nav>
  );
}