import { Briefcase } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Typography } from "@/components/ui/typography";
import { CareerScore } from "@/components/careers/career-score";
import { getCategoryById } from "@/lib/careers/career-categories";

interface CareerHeroProps {
  careerTitle: string;
  careerCategory: string;
  matchScore: number;
  description: string;
}

export function CareerHero({ careerTitle, careerCategory, matchScore, description }: CareerHeroProps) {
  const category = getCategoryById(careerCategory);
  const CategoryIcon = category?.icon ?? Briefcase;

  return (
    <Card className="rounded-2xl border border-border bg-gradient-to-br from-primary/5 via-white to-white p-7 shadow-sm">
      <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-primary/10">
            <CategoryIcon className="h-6 w-6 text-primary" aria-hidden="true" />
          </span>
          <div>
            <Badge variant="subtle" size="sm">
              {category?.name ?? careerCategory}
            </Badge>
            <Typography variant="h3" as="h1" className="mt-1.5 font-bold text-foreground">
              {careerTitle}
            </Typography>
          </div>
        </div>
        <CareerScore score={matchScore} size="lg" />
      </div>
      <Typography variant="bodySmall" className="mt-5 leading-relaxed text-muted-foreground">
        {description}
      </Typography>
    </Card>
  );
}