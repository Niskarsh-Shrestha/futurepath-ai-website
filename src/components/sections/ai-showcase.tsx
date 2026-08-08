"use client";

import { motion } from "framer-motion";
import { MessageCircle, TrendingUp, Map, Sparkles } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Typography } from "@/components/ui/typography";
import { Container } from "@/components/common/container";

export function AiShowcase() {
  return (
    <section id="ai-showcase" className="bg-secondary/40 py-24 md:py-32">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-2xl text-center"
        >
          <Typography variant="overline" className="text-primary">
            See It In Action
          </Typography>
          <Typography variant="h2" as="h2" className="mt-3 font-bold text-foreground">
            A dashboard built for clarity, not clutter
          </Typography>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-16"
        >
          <Card className="grid grid-cols-1 gap-4 rounded-2xl border border-border bg-white p-6 shadow-md md:grid-cols-2 md:p-8">
            <Card className="rounded-2xl border border-border bg-white p-6 shadow-none">
              <div className="mb-4 flex items-center gap-2.5">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
                  <Map className="h-4 w-4 text-primary" aria-hidden="true" />
                </span>
                <Typography variant="title" as="h3" className="font-semibold text-foreground">
                  Learning Roadmap
                </Typography>
              </div>
              <div className="space-y-3">
                {["Foundations", "Applied Skills", "Advanced Projects"].map((step, i) => (
                  <div key={step} className="flex items-center gap-3">
                    <div className="h-2 flex-1 overflow-hidden rounded-full bg-secondary">
                      <div
                        className="h-full rounded-full bg-primary"
                        style={{ width: `${80 - i * 25}%` }}
                      />
                    </div>
                    <Typography variant="caption" className="w-28 shrink-0 text-muted-foreground">
                      {step}
                    </Typography>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="rounded-2xl border border-border bg-white p-6 shadow-none">
              <div className="mb-4 flex items-center gap-2.5">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
                  <TrendingUp className="h-4 w-4 text-primary" aria-hidden="true" />
                </span>
                <Typography variant="title" as="h3" className="font-semibold text-foreground">
                  Skill Growth
                </Typography>
              </div>
              <div className="flex h-24 items-end gap-2">
                {[40, 55, 50, 70, 65, 85, 90].map((height, i) => (
                  <div
                    key={i}
                    className="flex-1 rounded-t-md bg-primary/70 transition-all duration-300"
                    style={{ height: `${height}%` }}
                  />
                ))}
              </div>
            </Card>

            <Card className="rounded-2xl border border-border bg-white p-6 shadow-none">
              <div className="mb-4 flex items-center gap-2.5">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
                  <Sparkles className="h-4 w-4 text-primary" aria-hidden="true" />
                </span>
                <Typography variant="title" as="h3" className="font-semibold text-foreground">
                  Career Match
                </Typography>
              </div>
              <Typography variant="display" as="p" className="text-3xl font-bold text-primary">
                94%
              </Typography>
              <Typography variant="bodySmall" className="mt-1.5 leading-relaxed text-muted-foreground">
                Software Engineering — based on 3 years of profile data
              </Typography>
            </Card>

            <Card className="rounded-2xl border border-border bg-white p-6 shadow-none">
              <div className="mb-4 flex items-center gap-2.5">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
                  <MessageCircle className="h-4 w-4 text-primary" aria-hidden="true" />
                </span>
                <Typography variant="title" as="h3" className="font-semibold text-foreground">
                  AI Chatbot
                </Typography>
              </div>
              <div className="space-y-2">
                <div className="w-fit max-w-[85%] rounded-2xl rounded-tl-sm bg-secondary px-3.5 py-2.5">
                  <Typography variant="bodySmall" className="text-foreground">
                    Why was coding recommended?
                  </Typography>
                </div>
                <div className="ml-auto w-fit max-w-[85%] rounded-2xl rounded-tr-sm bg-primary/10 px-3.5 py-2.5">
                  <Typography variant="bodySmall" className="text-foreground">
                    Based on strong problem-solving activity and consistent interest in building things.
                  </Typography>
                </div>
              </div>
            </Card>
          </Card>
        </motion.div>
      </Container>
    </section>
  );
}