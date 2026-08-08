"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Bot, Sparkles, TrendingUp, Briefcase } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Typography } from "@/components/ui/typography";

export interface AiStatusData {
  hasAnalysis: boolean;
  childName?: string;
  assessmentId?: string;
  lastAnalysis?: string;
  confidenceScore?: number;
  topCareerMatch?: string;
}

interface AiStatusCardProps {
  data: AiStatusData;
}

export function AiStatusCard({ data }: AiStatusCardProps) {
if (!data.hasAnalysis) {
  return (
    <Card className="flex h-full flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-white p-6 text-center shadow-sm">
      <span className="flex h-11 w-11 items-center justify-center rounded-full bg-secondary">
        <Bot className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
      </span>
      <Typography variant="title" as="h3" className="mt-3 font-semibold text-foreground">
        {data.assessmentId ? "Analysis pending" : "No AI analysis yet"}
      </Typography>
      <Typography variant="bodySmall" className="mt-1.5 text-muted-foreground">
        {data.assessmentId
          ? "Your assessment is submitted — view results to generate your AI analysis."
          : "Complete and submit an assessment to generate your first AI analysis."}
      </Typography>
      <Button variant="outline" size="sm" className="mt-4" asChild>
        <Link href={data.assessmentId ? `/dashboard/results/${data.assessmentId}` : "/dashboard/assessment"}>
          {data.assessmentId ? "View Results" : "Go to Assessment"}
        </Link>
      </Button>
    </Card>
  );
}

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      <Card className="flex h-full flex-col rounded-2xl border border-border bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10">
            <Bot className="h-5 w-5 text-primary" aria-hidden="true" />
          </span>
          <Badge variant="success" size="sm">
            Complete
          </Badge>
        </div>

        <Typography variant="title" as="h2" className="mt-4 font-semibold text-foreground">
          AI Status
        </Typography>
        <Typography variant="caption" className="mt-0.5 text-muted-foreground">
          {data.childName} · Last analysis: {data.lastAnalysis}
        </Typography>

        <div className="mt-5 space-y-4">
          <div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                <TrendingUp className="h-3.5 w-3.5" aria-hidden="true" />
                Confidence Score
              </span>
              <span className="text-xs font-semibold text-foreground">{data.confidenceScore}%</span>
            </div>
            <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-secondary">
              <motion.div
                className="h-full rounded-full bg-primary"
                initial={{ width: 0 }}
                animate={{ width: `${data.confidenceScore}%` }}
                transition={{ duration: 0.8, delay: 0.2 }}
              />
            </div>
          </div>

          <div className="rounded-xl bg-secondary/60 p-4">
            <span className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
              <Briefcase className="h-3.5 w-3.5" aria-hidden="true" />
              Top Career Match
            </span>
            <Typography variant="title" as="p" className="mt-1 font-semibold text-primary">
              {data.topCareerMatch}
            </Typography>
          </div>
        </div>

        <Button variant="primary" size="md" className="mt-6 w-full" leftIcon={<Sparkles className="h-4 w-4" />} asChild>
          <Link href={`/dashboard/results/${data.assessmentId}`}>View Full Results</Link>
        </Button>
      </Card>
    </motion.div>
  );
}