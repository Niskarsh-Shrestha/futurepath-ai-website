"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, GitCompareArrows } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Typography } from "@/components/ui/typography";
import { CareerScore } from "@/components/careers/career-score";
import { getCategoryById } from "@/lib/careers/career-categories";
import type { CareerCardData } from "@/components/careers/career-card";

interface CompareSelectorProps {
  careers: CareerCardData[];
  childId: string;
}

export function CompareSelector({ careers, childId }: CompareSelectorProps) {
  const router = useRouter();
  const [selected, setSelected] = useState<string[]>([]);

  function toggle(id: string) {
    setSelected((prev) => {
      if (prev.includes(id)) return prev.filter((s) => s !== id);
      if (prev.length === 2) return [prev[1], id]; // keep most recent 2 picks
      return [...prev, id];
    });
  }

  function handleCompare() {
    if (selected.length !== 2) return;
    router.push(`/dashboard/careers/compare?childId=${childId}&a=${selected[0]}&b=${selected[1]}`);
  }

  return (
    <div className="space-y-5">
      <Typography variant="bodySmall" className="text-muted-foreground">
        Select two careers to compare side by side.
      </Typography>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {careers.map((career) => {
          const isSelected = selected.includes(career.id);
          const category = getCategoryById(career.careerCategory);
          const CategoryIcon = category?.icon;

          return (
            <Card
              key={career.id}
              role="button"
              tabIndex={0}
              onClick={() => toggle(career.id)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  toggle(career.id);
                }
              }}
              className={cn(
                "flex cursor-pointer items-center gap-3 rounded-2xl border p-4 shadow-sm transition-all",
                isSelected
                  ? "border-primary bg-primary/5 ring-1 ring-primary"
                  : "border-border bg-white hover:border-primary/30"
              )}
            >
              <span
                className={cn(
                  "flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
                  isSelected ? "border-primary bg-primary" : "border-border bg-white"
                )}
              >
                {isSelected && <Check className="h-3.5 w-3.5 text-primary-foreground" aria-hidden="true" />}
              </span>

              {CategoryIcon && (
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10">
                  <CategoryIcon className="h-4 w-4 text-primary" aria-hidden="true" />
                </span>
              )}

              <div className="min-w-0 flex-1">
                <Typography variant="bodySmall" className="truncate font-semibold text-foreground">
                  {career.careerTitle}
                </Typography>
                <Badge variant="subtle" size="sm" className="mt-1">
                  {category?.name ?? career.careerCategory}
                </Badge>
              </div>

              <CareerScore score={career.matchScore} size="sm" />
            </Card>
          );
        })}
      </div>

      <div className="flex items-center justify-between rounded-2xl border border-border bg-secondary/40 p-4">
        <Typography variant="bodySmall" className="text-muted-foreground">
          {selected.length === 0 && "No careers selected"}
          {selected.length === 1 && "1 of 2 selected — pick one more"}
          {selected.length === 2 && "2 selected — ready to compare"}
        </Typography>
        <Button
          variant="primary"
          size="md"
          leftIcon={<GitCompareArrows className="h-4 w-4" />}
          disabled={selected.length !== 2}
          onClick={handleCompare}
        >
          Compare
        </Button>
      </div>
    </div>
  );
}