"use client";

import { motion } from "framer-motion";
import { PhaseCard } from "@/components/roadmap/phase-card";
import type { RoadmapView } from "@/lib/roadmap/roadmap-types";

interface RoadmapTimelineProps {
  roadmap: RoadmapView;
}

export function RoadmapTimeline({ roadmap }: RoadmapTimelineProps) {
  return (
    <div className="relative">
      <div
        className="absolute left-6 top-2 hidden h-[calc(100%-1rem)] w-px bg-border sm:block"
        aria-hidden="true"
      />
      <div className="space-y-4">
        {roadmap.phases.map((phase, index) => {
          const isCurrent = roadmap.currentPhase?.id === phase.id;
          return (
            <motion.div
              key={phase.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.08 }}
              className="relative sm:pl-14"
            >
              <span
                className="absolute left-3.5 top-6 hidden h-5 w-5 items-center justify-center rounded-full border-2 border-white bg-primary text-[10px] font-bold text-white sm:flex"
                style={{
                  backgroundColor: phase.isComplete
                    ? "var(--success)"
                    : isCurrent
                      ? "var(--primary)"
                      : "var(--secondary)",
                  color: phase.isComplete || isCurrent ? "white" : "var(--muted-foreground)",
                }}
                aria-hidden="true"
              >
                {phase.order}
              </span>
              <PhaseCard phase={phase} defaultExpanded={isCurrent} />
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}