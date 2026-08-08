"use client";

import { motion } from "framer-motion";
import { Sparkles, Map, Target, FileText } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Typography } from "@/components/ui/typography";
import { Container } from "@/components/common/container";

const FEATURES = [
  {
    icon: Sparkles,
    title: "AI Career Analysis",
    description: "Personalized AI analysis based on your child's assessment.",
  },
  {
    icon: Map,
    title: "Learning Roadmaps",
    description: "Structured step-by-step learning plans generated for recommended careers.",
  },
  {
    icon: Target,
    title: "Career Recommendations",
    description: "AI-powered career matching with explanations and comparisons.",
  },
  {
    icon: FileText,
    title: "AI Reports",
    description: "Comprehensive downloadable AI-generated career reports.",
  },
];

export function Stats() {
  return (
    <section id="trusted-by" className="py-16">
      <Container>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center text-sm font-medium uppercase tracking-wider text-[#6B7280]"
        >
          Everything you need to guide your child&apos;s future
        </motion.p>

        <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-4">
          {FEATURES.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="group flex flex-col items-center gap-3 rounded-2xl border border-[#E5E7EB] bg-white p-8 text-center shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 transition-transform duration-300 group-hover:scale-110">
                  <feature.icon className="h-6 w-6 text-primary" aria-hidden="true" />
                </div>
                <Typography variant="bodySmall" className="font-semibold text-[#111827]">
                  {feature.title}
                </Typography>
                <Typography variant="caption" className="text-[#6B7280]">
                  {feature.description}
                </Typography>
              </Card>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}