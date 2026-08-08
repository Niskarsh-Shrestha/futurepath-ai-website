import { DollarSign } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Typography } from "@/components/ui/typography";

interface SalaryCardProps {
  salaryRange: string;
}

export function SalaryCard({ salaryRange }: SalaryCardProps) {
  return (
    <Card className="rounded-2xl border border-border bg-white p-5 shadow-sm">
      <div className="flex items-center gap-2">
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-success/10">
          <DollarSign className="h-4.5 w-4.5 text-success" aria-hidden="true" />
        </span>
        <Typography variant="caption" className="font-semibold uppercase tracking-wider text-muted-foreground">
          Salary Range
        </Typography>
      </div>
      <Typography variant="title" as="p" className="mt-2 font-bold text-foreground">
        {salaryRange}
      </Typography>
      <Typography variant="caption" className="mt-0.5 text-muted-foreground">
        Per year, varies by location and experience
      </Typography>
    </Card>
  );
}