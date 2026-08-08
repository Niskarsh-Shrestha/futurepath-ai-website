"use client";

import { useMemo, useState } from "react";
import { Briefcase } from "lucide-react";
import { cn } from "@/lib/utils";
import { CAREER_CATEGORIES } from "@/lib/careers/career-categories";
import { RecommendationList } from "@/components/careers/recommendation-list";
import type { CareerCardData } from "@/components/careers/career-card";

interface CategoryFilterProps {
  careers: CareerCardData[];
}

export function CategoryFilter({ careers }: CategoryFilterProps) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const presentCategoryIds = useMemo(
    () => new Set(careers.map((c) => c.careerCategory)),
    [careers]
  );

  const availableCategories = CAREER_CATEGORIES.filter((c) => presentCategoryIds.has(c.id));

  const filteredCareers = activeCategory
    ? careers.filter((c) => c.careerCategory === activeCategory)
    : careers;

  if (availableCategories.length <= 1) {
    // Nothing meaningful to filter (0 or 1 category present) — skip
    // the filter bar entirely rather than showing a single useless pill.
    return <RecommendationList careers={careers} />;
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setActiveCategory(null)}
          className={cn(
            "inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors",
            activeCategory === null
              ? "border-primary bg-primary text-primary-foreground"
              : "border-border bg-white text-muted-foreground hover:border-primary/40 hover:text-foreground"
          )}
        >
          <Briefcase className="h-3.5 w-3.5" aria-hidden="true" />
          All
        </button>
        {availableCategories.map((category) => {
          const Icon = category.icon;
          const isActive = activeCategory === category.id;
          return (
            <button
              key={category.id}
              type="button"
              onClick={() => setActiveCategory(category.id)}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors",
                isActive
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-white text-muted-foreground hover:border-primary/40 hover:text-foreground"
              )}
            >
              <Icon className="h-3.5 w-3.5" aria-hidden="true" />
              {category.name}
            </button>
          );
        })}
      </div>
      <RecommendationList careers={filteredCareers} />
    </div>
  );
}