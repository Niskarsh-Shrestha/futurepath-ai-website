import Link from "next/link";
import { ArrowRight, Briefcase, Map } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Typography } from "@/components/ui/typography";
import { CareerScore } from "@/components/careers/career-score";
import { getCategoryById } from "@/lib/careers/career-categories";
import { getDemandBadgeVariant, type FutureDemand } from "@/lib/careers/demand-data";

export interface CareerCardData {
  id: string;
  careerTitle: string;
  careerCategory: string;
  matchScore: number;
  salaryRange: string;
  futureDemand: string;
  description: string;
  /** Optional — when known, toggles the roadmap button's label. Both
   * outcomes link to the same route since that page self-resolves
   * whether to show the roadmap or the generate trigger. */
  hasRoadmap?: boolean;
}

interface CareerCardProps {
  career: CareerCardData;
}

export function CareerCard({ career }: CareerCardProps) {
  const category = getCategoryById(career.careerCategory);
  const CategoryIcon = category?.icon ?? Briefcase;

  return (
    <Card className="group flex h-full flex-col rounded-2xl border border-border bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 transition-transform duration-300 group-hover:scale-110">
            <CategoryIcon className="h-4.5 w-4.5 text-primary" aria-hidden="true" />
          </span>
          <div>
            <Badge variant="subtle" size="sm">
              {category?.name ?? career.careerCategory}
            </Badge>
          </div>
        </div>
        <CareerScore score={career.matchScore} size="sm" />
      </div>

      <Typography variant="title" as="h3" className="mt-3 font-semibold text-foreground">
        {career.careerTitle}
      </Typography>
      <Typography variant="bodySmall" className="mt-1.5 line-clamp-2 text-muted-foreground">
        {career.description}
      </Typography>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <Badge variant="outline" size="sm">
          {career.salaryRange}
        </Badge>
        <Badge variant={getDemandBadgeVariant(career.futureDemand as FutureDemand)} size="sm">
          {career.futureDemand} demand
        </Badge>
      </div>

      <div className="mt-auto flex gap-2 pt-4">
        <Button variant="outline" size="sm" className="flex-1" rightIcon={<ArrowRight className="h-3.5 w-3.5" />} asChild>
          <Link href={`/dashboard/careers/${career.id}`}>Details</Link>
        </Button>
        <Button variant="outline" size="sm" className="flex-1" leftIcon={<Map className="h-3.5 w-3.5" />} asChild>
          <Link href={`/dashboard/roadmap/${career.id}`}>
            {career.hasRoadmap === false ? "Generate Roadmap" : "View Roadmap"}
          </Link>
        </Button>
      </div>
    </Card>
  );
}