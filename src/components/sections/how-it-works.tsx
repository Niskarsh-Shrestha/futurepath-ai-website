"use client";

import { motion } from "framer-motion";
import { UserPlus, BrainCircuit, Map, Activity, Briefcase, RefreshCw } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Typography } from "@/components/ui/typography";
import { Container } from "@/components/common/container";

const STEPS = [
  { icon: UserPlus, title: "Create Profile", description: "Parents set up a profile with interests, hobbies, and goals." },
  { icon: BrainCircuit, title: "AI Analysis", description: "The AI analyses patterns across interests, behaviour, and learning style." },
  { icon: Map, title: "Learning Roadmap", description: "A personalised roadmap is generated based on the analysis." },
  { icon: Activity, title: "Activities", description: "Suggested activities and resources support day-to-day growth." },
  { icon: Briefcase, title: "Career Suggestions", description: "Long-term career directions are shaped from years of data." },
  { icon: RefreshCw, title: "Continuous Improvement", description: "Every update refines the roadmap and recommendations further." },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 md:py-32">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-2xl text-center"
        >
          <Typography variant="overline" className="text-primary">
            How It Works
          </Typography>
          <Typography variant="h2" as="h2" className="mt-3 font-bold text-foreground">
            AI that learns as your child grows
          </Typography>
        </motion.div>

        <div className="relative mx-auto mt-16 max-w-md">
          <div
            className="absolute left-6 top-6 bottom-6 w-px bg-border"
            aria-hidden="true"
          />
          <div className="flex flex-col gap-5">
            {STEPS.map((step, index) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
              >
                <Card className="relative flex w-full items-start gap-4 rounded-2xl border border-border bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                  <div className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10">
                    <step.icon className="h-5 w-5 text-primary" aria-hidden="true" />
                    <span className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                      {index + 1}
                    </span>
                  </div>
                  <div>
                    <Typography variant="title" as="h3" className="font-semibold text-foreground">
                      {step.title}
                    </Typography>
                    <Typography variant="bodySmall" className="mt-1 leading-relaxed text-muted-foreground">
                      {step.description}
                    </Typography>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}