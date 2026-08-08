"use client";

import { motion } from "framer-motion";
import { CareerCard, type CareerCardData } from "@/components/careers/career-card";
import { EmptyState } from "@/components/ui/empty-state";
import { Compass } from "lucide-react";

interface RecommendationListProps {
  careers: CareerCardData[];
}

export function RecommendationList({ careers }: RecommendationListProps) {
  if (careers.length === 0) {
    return (
      <EmptyState
        icon={Compass}
        title="No career recommendations yet"
        description="Complete an AI analysis to generate personalized career recommendations."
      />
    );
  }

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {careers.map((career, index) => (
        <motion.div
          key={career.id}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: index * 0.08 }}
        >
          <CareerCard career={career} />
        </motion.div>
      ))}
    </div>
  );
}