"use client";

import { motion } from "framer-motion";
import { Sparkles, Map, FileText } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Typography } from "@/components/ui/typography";
import { Container } from "@/components/common/container";

const CAPABILITIES = [
  {
    icon: Sparkles,
    title: "AI-Powered Career Analysis",
    description:
      "Analyze assessment responses to identify strengths, learning preferences, and potential career pathways.",
  },
  {
    icon: Map,
    title: "Personalized Learning Roadmaps",
    description:
      "Generate structured learning plans with milestones, resources, and progress tracking for each recommended career.",
  },
  {
    icon: FileText,
    title: "Comprehensive AI Reports",
    description:
      "Download professional AI-generated reports summarizing assessment results, career recommendations, and learning guidance.",
  },
];

export function Testimonials() {
  return (
    <section id="testimonials" className="py-24 md:py-32">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-2xl text-center"
        >
          <Typography variant="overline" className="text-primary">
            Why Parents Choose FuturePath AI
          </Typography>
          <Typography variant="h2" as="h2" className="mt-3 font-bold text-foreground">
            Guidance built on real AI capabilities
          </Typography>
        </motion.div>

        <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-3">
          {CAPABILITIES.map((c, index) => (
            <motion.div
              key={c.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <Card className="flex h-full flex-col rounded-2xl border border-border bg-white p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <c.icon className="h-6 w-6 text-primary" aria-hidden="true" />
                </span>

                <Typography variant="title" as="p" className="mt-5 text-sm font-semibold text-foreground">
                  {c.title}
                </Typography>

                <Typography variant="body" className="mt-2 flex-1 leading-relaxed text-muted-foreground">
                  {c.description}
                </Typography>
              </Card>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}