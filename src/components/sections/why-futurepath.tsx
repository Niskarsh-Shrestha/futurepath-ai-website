"use client";

import { motion } from "framer-motion";
import { Check, X } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Typography } from "@/components/ui/typography";
import { Container } from "@/components/common/container";

const COMPARISON = [
  { label: "One-time assessment only", traditional: true, futurepath: false },
  { label: "Continuously evolving profile", traditional: false, futurepath: true },
  { label: "Works only for teenagers", traditional: true, futurepath: false },
  { label: "Supports ages 5–18", traditional: false, futurepath: true },
  { label: "Black-box recommendations", traditional: true, futurepath: false },
  { label: "Explainable AI (XAI)", traditional: false, futurepath: true },
  { label: "Static exam-score focus", traditional: true, futurepath: false },
  { label: "Whole-child development focus", traditional: false, futurepath: true },
];

export function WhyFuturePath() {
  return (
    <section id="why-futurepath" className="bg-secondary/40 py-24 md:py-32">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-2xl text-center"
        >
          <Typography variant="overline" className="text-primary">
            Why FuturePath AI
          </Typography>
          <Typography variant="h2" as="h2" className="mt-3 font-bold text-foreground">
            A fundamentally different approach
          </Typography>
        </motion.div>

        <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Card className="h-full rounded-2xl border border-border bg-white p-7 shadow-sm">
              <Typography variant="title" as="h3" className="font-semibold text-muted-foreground">
                Traditional Career Guidance
              </Typography>
              <ul className="mt-5 space-y-3.5">
                {COMPARISON.map((item) => (
                  <li key={item.label} className="flex items-start gap-3">
                    {item.traditional ? (
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-secondary">
                        <Check className="h-3 w-3 text-muted-foreground" aria-hidden="true" />
                      </span>
                    ) : (
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-secondary">
                        <X className="h-3 w-3 text-muted-foreground/50" aria-hidden="true" />
                      </span>
                    )}
                    <Typography variant="bodySmall" className="text-muted-foreground">
                      {item.label}
                    </Typography>
                  </li>
                ))}
              </ul>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Card className="h-full rounded-2xl border border-primary/20 bg-white p-7 shadow-md">
              <Typography variant="title" as="h3" className="font-semibold text-primary">
                FuturePath AI
              </Typography>
              <ul className="mt-5 space-y-3.5">
                {COMPARISON.map((item) => (
                  <li key={item.label} className="flex items-start gap-3">
                    {item.futurepath ? (
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10">
                        <Check className="h-3 w-3 text-primary" aria-hidden="true" />
                      </span>
                    ) : (
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-secondary">
                        <X className="h-3 w-3 text-muted-foreground/50" aria-hidden="true" />
                      </span>
                    )}
                    <Typography variant="bodySmall" className="text-foreground">
                      {item.label}
                    </Typography>
                  </li>
                ))}
              </ul>
            </Card>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}