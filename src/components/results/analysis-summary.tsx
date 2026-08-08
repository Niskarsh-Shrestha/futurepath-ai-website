import { Sparkles, Brain, GraduationCap, Compass } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Typography } from "@/components/ui/typography";
import { ConfidenceMeter } from "@/components/results/confidence-meter";

interface AnalysisSummaryProps {
  childName: string;
  summary: string;
  personalityAnalysis: string;
  learningStyleAnalysis: string;
  careerInterestAnalysis: string;
  confidenceScore: number;
  analysisDate: Date;
}

export function AnalysisSummary({
  childName,
  summary,
  personalityAnalysis,
  learningStyleAnalysis,
  careerInterestAnalysis,
  confidenceScore,
  analysisDate,
}: AnalysisSummaryProps) {
  const formattedDate = analysisDate.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <Card className="rounded-2xl border border-border bg-white p-7 shadow-sm">
      <div className="flex flex-col items-start gap-6 sm:flex-row sm:justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
              <Sparkles className="h-4.5 w-4.5 text-primary" aria-hidden="true" />
            </span>
            <Typography variant="title" as="h2" className="font-semibold text-foreground">
              {childName}&apos;s AI Analysis
            </Typography>
          </div>
          <Typography variant="bodySmall" className="mt-3 leading-relaxed text-foreground">
            {summary}
          </Typography>
          <Typography variant="caption" className="mt-3 block text-muted-foreground">
            Generated {formattedDate}
          </Typography>
        </div>
        <ConfidenceMeter score={confidenceScore} />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 border-t border-border pt-6 sm:grid-cols-3">
        <AnalysisBlock icon={Brain} title="Personality" text={personalityAnalysis} />
        <AnalysisBlock icon={GraduationCap} title="Learning Style" text={learningStyleAnalysis} />
        <AnalysisBlock icon={Compass} title="Career Interests" text={careerInterestAnalysis} />
      </div>
    </Card>
  );
}

function AnalysisBlock({
  icon: Icon,
  title,
  text,
}: {
  icon: typeof Brain;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-xl bg-secondary/50 p-4">
      <div className="flex items-center gap-2">
        <Icon className="h-4 w-4 text-primary" aria-hidden="true" />
        <Typography variant="caption" className="font-semibold uppercase tracking-wider text-muted-foreground">
          {title}
        </Typography>
      </div>
      <Typography variant="bodySmall" className="mt-2 leading-relaxed text-foreground">
        {text}
      </Typography>
    </div>
  );
}