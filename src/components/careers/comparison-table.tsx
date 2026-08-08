import Link from "next/link";
import { Briefcase, Trophy } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Typography } from "@/components/ui/typography";
import { CareerScore } from "@/components/careers/career-score";
import { getCategoryById } from "@/lib/careers/career-categories";
import { getDemandBadgeVariant, type FutureDemand } from "@/lib/careers/demand-data";
import { cn } from "@/lib/utils";
import type { CareerComparisonSide } from "@/actions/careers/compare-careers";

interface ComparisonTableProps {
  careerA: CareerComparisonSide;
  careerB: CareerComparisonSide;
}

interface ComparisonRow {
  label: string;
  renderA: React.ReactNode;
  renderB: React.ReactNode;
  winner?: "a" | "b" | "tie";
}

export function ComparisonTable({ careerA, careerB }: ComparisonTableProps) {
  const categoryA = getCategoryById(careerA.careerCategory);
  const categoryB = getCategoryById(careerB.careerCategory);

  const rows: ComparisonRow[] = [
    {
      label: "Match Score",
      renderA: `${careerA.matchScore}%`,
      renderB: `${careerB.matchScore}%`,
      winner: careerA.matchScore === careerB.matchScore ? "tie" : careerA.matchScore > careerB.matchScore ? "a" : "b",
    },
    { label: "Salary Range", renderA: careerA.salaryRange, renderB: careerB.salaryRange },
    { label: "Education Level", renderA: careerA.educationLevel, renderB: careerB.educationLevel },
    { label: "Difficulty", renderA: careerA.difficulty, renderB: careerB.difficulty },
    {
      label: "Future Demand",
      renderA: <Badge variant={getDemandBadgeVariant(careerA.futureDemand as FutureDemand)} size="sm">{careerA.futureDemand}</Badge>,
      renderB: <Badge variant={getDemandBadgeVariant(careerB.futureDemand as FutureDemand)} size="sm">{careerB.futureDemand}</Badge>,
    },
    { label: "Automation Risk", renderA: careerA.automationRisk, renderB: careerB.automationRisk },
    { label: "Work Environment", renderA: careerA.workEnvironment, renderB: careerB.workEnvironment },
    {
      label: "Growth Rate",
      renderA: `${careerA.growthRate > 0 ? "+" : ""}${careerA.growthRate}%`,
      renderB: `${careerB.growthRate > 0 ? "+" : ""}${careerB.growthRate}%`,
      winner: careerA.growthRate === careerB.growthRate ? "tie" : careerA.growthRate > careerB.growthRate ? "a" : "b",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        {[careerA, careerB].map((career, i) => {
          const category = i === 0 ? categoryA : categoryB;
          const CategoryIcon = category?.icon ?? Briefcase;
          return (
            <Card key={career.id} className="flex flex-col items-center gap-3 rounded-2xl border border-border bg-white p-6 text-center shadow-sm">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <CategoryIcon className="h-5 w-5 text-primary" aria-hidden="true" />
              </span>
              <div>
                <Badge variant="subtle" size="sm">{category?.name ?? career.careerCategory}</Badge>
                <Typography variant="title" as="h3" className="mt-1.5 font-bold text-foreground">
                  {career.careerTitle}
                </Typography>
              </div>
              <CareerScore score={career.matchScore} size="md" />
              <Button variant="outline" size="sm" asChild className="mt-1">
                <Link href={`/dashboard/careers/${career.id}`}>View Details</Link>
              </Button>
            </Card>
          );
        })}
      </div>

      <Card className="overflow-hidden rounded-2xl border border-border bg-white shadow-sm">
        <table className="w-full text-sm">
          <tbody>
            {rows.map((row, i) => (
              <tr key={row.label} className={cn(i % 2 === 1 && "bg-secondary/30")}>
                <td className="w-1/3 px-5 py-3.5 font-medium text-muted-foreground">{row.label}</td>
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-1.5 text-foreground">
                    {row.winner === "a" && <Trophy className="h-3.5 w-3.5 shrink-0 text-success" aria-hidden="true" />}
                    {row.renderA}
                  </div>
                </td>
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-1.5 text-foreground">
                    {row.winner === "b" && <Trophy className="h-3.5 w-3.5 shrink-0 text-success" aria-hidden="true" />}
                    {row.renderB}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}