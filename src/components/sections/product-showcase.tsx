"use client";

import { motion } from "framer-motion";
import {
  UserCircle,
  ClipboardCheck,
  Brain,
  Briefcase,
  Map,
  Bot,
  FileText,
  ArrowRight,
  TrendingUp,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Typography } from "@/components/ui/typography";

const PIPELINE_STEPS = [
  { icon: ClipboardCheck, label: "Assessment" },
  { icon: Brain, label: "AI Analysis" },
  { icon: Briefcase, label: "Career Match" },
  { icon: Map, label: "Roadmap" },
  { icon: FileText, label: "Report" },
];

export function ProductShowcase() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.7, delay: 0.4 }}
      className="w-full max-w-4xl"
    >
      <Card className="rounded-2xl border border-border bg-gradient-to-br from-secondary/60 to-white p-4 shadow-lg sm:p-6">
        {/* Pipeline strip */}
        <div className="mb-5 flex items-center justify-between overflow-x-auto rounded-xl border border-border bg-white px-3 py-3 sm:px-5">
          {PIPELINE_STEPS.map((step, index) => (
            <div key={step.label} className="flex items-center">
              <div className="flex flex-col items-center gap-1.5">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 sm:h-9 sm:w-9">
                  <step.icon className="h-4 w-4 text-primary" aria-hidden="true" />
                </span>
                <Typography variant="caption" className="whitespace-nowrap text-muted-foreground">
                  {step.label}
                </Typography>
              </div>
              {index < PIPELINE_STEPS.length - 1 && (
                <ArrowRight
                  className="mx-1.5 h-3.5 w-3.5 shrink-0 text-border sm:mx-3"
                  aria-hidden="true"
                />
              )}
            </div>
          ))}
        </div>

        {/* Dashboard preview grid */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {/* Child Profile */}
          <Card className="col-span-2 flex items-center gap-3 rounded-xl border border-border bg-white p-4 shadow-none sm:col-span-1">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
              <UserCircle className="h-5 w-5 text-primary" aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <Typography variant="bodySmall" className="truncate font-semibold text-foreground">
                Emma, age 11
              </Typography>
              <Typography variant="caption" className="text-muted-foreground">
                Child Profile
              </Typography>
            </div>
          </Card>

          {/* Assessment Progress */}
          <Card className="rounded-xl border border-border bg-white p-4 shadow-none">
            <Typography variant="caption" className="font-semibold uppercase tracking-wider text-muted-foreground">
              Assessment
            </Typography>
            <div className="mt-2 flex items-center gap-2">
              <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-secondary">
                <div className="h-full w-full rounded-full bg-success" />
              </div>
              <Typography variant="caption" className="font-semibold text-success">
                100%
              </Typography>
            </div>
          </Card>

          {/* Learning Roadmap Progress */}
          <Card className="rounded-xl border border-border bg-white p-4 shadow-none">
            <Typography variant="caption" className="font-semibold uppercase tracking-wider text-muted-foreground">
              Roadmap
            </Typography>
            <div className="mt-2 flex items-center gap-2">
              <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-secondary">
                <div className="h-full w-[42%] rounded-full bg-primary" />
              </div>
              <Typography variant="caption" className="font-semibold text-primary">
                42%
              </Typography>
            </div>
          </Card>

          {/* AI Analysis Summary */}
          <Card className="col-span-2 rounded-xl border border-border bg-white p-4 shadow-none sm:col-span-1">
            <div className="flex items-center gap-1.5">
              <Brain className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
              <Typography variant="caption" className="font-semibold uppercase tracking-wider text-muted-foreground">
                AI Analysis
              </Typography>
            </div>
            <Typography variant="caption" className="mt-2 block leading-relaxed text-foreground">
              Strong analytical thinking and creative problem-solving.
            </Typography>
          </Card>

          {/* Top Career Recommendation */}
          <Card className="col-span-2 rounded-xl border border-primary/20 bg-primary/5 p-4 shadow-none sm:col-span-1">
            <div className="flex items-center gap-1.5">
              <Briefcase className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
              <Typography variant="caption" className="font-semibold uppercase tracking-wider text-primary">
                Top Match
              </Typography>
            </div>
            <div className="mt-1.5 flex items-center justify-between">
              <Typography variant="bodySmall" className="font-bold text-foreground">
                Software Engineer
              </Typography>
              <span className="flex items-center gap-1 text-xs font-bold text-primary">
                <TrendingUp className="h-3 w-3" aria-hidden="true" />
                94%
              </span>
            </div>
          </Card>

          {/* AI Assistant */}
          <Card className="rounded-xl border border-border bg-white p-4 shadow-none">
            <div className="flex items-center gap-1.5">
              <Bot className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
              <Typography variant="caption" className="font-semibold uppercase tracking-wider text-muted-foreground">
                AI Assistant
              </Typography>
            </div>
            <Typography variant="caption" className="mt-2 block leading-relaxed text-muted-foreground">
              &ldquo;What should Emma learn next?&rdquo;
            </Typography>
          </Card>

          {/* Career Report */}
          <Card className="rounded-xl border border-border bg-white p-4 shadow-none">
            <div className="flex items-center gap-1.5">
              <FileText className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
              <Typography variant="caption" className="font-semibold uppercase tracking-wider text-muted-foreground">
                Career Report
              </Typography>
            </div>
            <Typography variant="caption" className="mt-2 block font-medium text-success">
              Ready to download
            </Typography>
          </Card>
        </div>
      </Card>
    </motion.div>
  );
}