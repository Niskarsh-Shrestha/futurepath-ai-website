"use client";

import { motion } from "framer-motion";
import {
  UserCircle,
  BrainCircuit,
  Map,
  TrendingUp,
  Briefcase,
  MessageCircle,
  Lightbulb,
  FileText,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Typography } from "@/components/ui/typography";
import { Container } from "@/components/common/container";

const FEATURES = [
  {
    icon: UserCircle,
    title: "Child Profile",
    description: "A living profile of interests, strengths, and behaviour that grows with your child.",
  },
  {
    icon: BrainCircuit,
    title: "AI Analysis",
    description: "Continuous analysis of new information to refine understanding over time.",
  },
  {
    icon: Map,
    title: "Learning Roadmaps",
    description: "Personalised, age-appropriate roadmaps that adapt as your child develops.",
  },
  {
    icon: TrendingUp,
    title: "Progress Tracking",
    description: "Visual tracking of milestones, skills, and growth across every stage.",
  },
  {
    icon: Briefcase,
    title: "Career Recommendations",
    description: "Long-term career direction grounded in real strengths, not one-time quizzes.",
  },
  {
    icon: MessageCircle,
    title: "AI Chatbot",
    description: "An always-available assistant to answer questions about your child's journey.",
  },
  {
    icon: Lightbulb,
    title: "Explainable AI",
    description: "Every recommendation comes with a clear reason — never a black box.",
  },
  {
    icon: FileText,
    title: "Personalised Reports",
    description: "Detailed, shareable reports to support decisions with schools and counsellors.",
  },
];

export function Features() {
  return (
    <section id="features" className="bg-secondary/40 py-24 md:py-32">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-2xl text-center"
        >
          <Typography variant="overline" className="text-primary">
            Features
          </Typography>
          <Typography variant="h2" as="h2" className="mt-3 font-bold text-foreground">
            Everything you need to guide your child&apos;s future
          </Typography>
          <Typography variant="subtitle" as="p" className="mt-4 leading-relaxed text-muted-foreground">
            One platform that learns alongside your child, from their first hobby to their first
            career decision.
          </Typography>
        </motion.div>

        <div className="mt-16 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: (index % 4) * 0.08 }}
            >
              <Card className="group h-full rounded-2xl border border-border bg-white p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 transition-transform duration-300 group-hover:scale-110">
                  <feature.icon className="h-5 w-5 text-primary" aria-hidden="true" />
                </div>
                <Typography variant="title" as="h3" className="font-semibold text-foreground">
                  {feature.title}
                </Typography>
                <Typography variant="bodySmall" className="mt-2 leading-relaxed text-muted-foreground">
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