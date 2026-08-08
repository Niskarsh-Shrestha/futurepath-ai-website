import { FileText } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Typography } from "@/components/ui/typography";
import { CareerScore } from "@/components/careers/career-score";

interface ReportHeroProps {
  childName: string;
  childAge: number;
  topCareerMatch: string;
  confidenceScore: number;
  generatedAt: Date;
}

export function ReportHero({ childName, childAge, topCareerMatch, confidenceScore, generatedAt }: ReportHeroProps) {
  const formattedDate = generatedAt.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });

  return (
    <Card className="rounded-2xl border border-border bg-gradient-to-br from-primary/5 via-white to-white p-7 shadow-sm">
      <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-primary/10">
            <FileText className="h-6 w-6 text-primary" aria-hidden="true" />
          </span>
          <div>
            <Badge variant="subtle" size="sm">Career Discovery Report</Badge>
            <Typography variant="h3" as="h1" className="mt-1.5 font-bold text-foreground">
              {childName}, age {childAge}
            </Typography>
            <Typography variant="caption" className="mt-0.5 text-muted-foreground">
              Generated {formattedDate}
            </Typography>
          </div>
        </div>
        <CareerScore score={confidenceScore} size="lg" />
      </div>
      <div className="mt-5 rounded-xl bg-secondary/60 p-4">
        <Typography variant="caption" className="font-semibold uppercase tracking-wider text-muted-foreground">
          Top Career Match
        </Typography>
        <Typography variant="title" as="p" className="mt-1 font-bold text-primary">
          {topCareerMatch}
        </Typography>
      </div>
    </Card>
  );
}