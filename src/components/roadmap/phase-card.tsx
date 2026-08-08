"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Clock } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Typography } from "@/components/ui/typography";
import { CompletionBadge, getCompletionState } from "@/components/roadmap/completion-badge";
import { ResourceCard } from "@/components/roadmap/resource-card";
import { MilestoneCard } from "@/components/roadmap/milestone-card";
import { cn } from "@/lib/utils";
import type { RoadmapPhaseView } from "@/lib/roadmap/roadmap-types";

interface PhaseCardProps {
  phase: RoadmapPhaseView;
  defaultExpanded?: boolean;
}

export function PhaseCard({ phase, defaultExpanded = false }: PhaseCardProps) {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const completionState = getCompletionState(phase.isComplete, phase.progressPercent);
  const contentId = `phase-content-${phase.id}`;

  return (
    <Card className="overflow-hidden rounded-2xl border border-border bg-white shadow-sm">
      <button
        type="button"
        onClick={() => setExpanded((prev) => !prev)}
        aria-expanded={expanded}
        aria-controls={contentId}
        className="flex w-full items-start justify-between gap-4 p-6 text-left transition-colors hover:bg-secondary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <Typography variant="title" as="h3" className="font-semibold text-foreground">
              {phase.title}
            </Typography>
            <CompletionBadge state={completionState} size="sm" />
          </div>
          <Typography variant="bodySmall" className="mt-1.5 leading-relaxed text-muted-foreground">
            {phase.description}
          </Typography>
          <div className="mt-3 flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Clock className="h-3.5 w-3.5" aria-hidden="true" />
              {phase.estimatedWeeks} weeks
            </span>
            <div className="flex flex-1 items-center gap-2">
              <div className="h-1.5 w-24 overflow-hidden rounded-full bg-secondary">
                <div
                  className="h-full rounded-full bg-primary transition-all duration-500"
                  style={{ width: `${phase.progressPercent}%` }}
                />
              </div>
              <span className="text-xs font-medium text-muted-foreground">{phase.progressPercent}%</span>
            </div>
          </div>
        </div>
        <ChevronDown
          className={cn("mt-1 h-5 w-5 shrink-0 text-muted-foreground transition-transform duration-300", expanded && "rotate-180")}
          aria-hidden="true"
        />
      </button>

      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            id={contentId}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden border-t border-border"
          >
            <div className="space-y-5 p-6">
              {phase.resources.length > 0 && (
                <div>
                  <Typography variant="caption" className="font-semibold uppercase tracking-wider text-muted-foreground">
                    Resources
                  </Typography>
                  <div className="mt-3 space-y-2.5">
                    {phase.resources.map((resource) => (
                      <ResourceCard key={resource.id} resource={resource} />
                    ))}
                  </div>
                </div>
              )}

              {phase.milestones.length > 0 && (
                <div>
                  <Typography variant="caption" className="font-semibold uppercase tracking-wider text-muted-foreground">
                    Milestones
                  </Typography>
                  <div className="mt-3 space-y-2.5">
                    {phase.milestones.map((milestone) => (
                      <MilestoneCard key={milestone.id} milestone={milestone} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}