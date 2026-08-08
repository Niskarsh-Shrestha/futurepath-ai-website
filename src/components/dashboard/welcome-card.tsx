"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Typography } from "@/components/ui/typography";

interface WelcomeCardProps {
  firstName: string;
}

function getTodayFormatted(): string {
  return new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}

const MOTIVATIONAL_MESSAGES = [
  "Every small step builds toward a bigger picture.",
  "Consistency is what turns interests into strengths.",
  "Today is a good day to learn something new.",
];

export function WelcomeCard({ firstName }: WelcomeCardProps) {
  const message = MOTIVATIONAL_MESSAGES[new Date().getDay() % MOTIVATIONAL_MESSAGES.length];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-primary via-primary to-primary-hover p-7 text-white shadow-sm md:p-8"
    >
      <motion.div
        className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/10"
        animate={{ scale: [1, 1.08, 1] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        aria-hidden="true"
      />
      <motion.div
        className="pointer-events-none absolute -bottom-10 right-24 h-40 w-40 rounded-full bg-white/10"
        animate={{ scale: [1, 1.12, 1] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        aria-hidden="true"
      />

      <div className="relative">
        <Typography variant="caption" className="font-medium uppercase tracking-wider text-white/80">
          {getTodayFormatted()}
        </Typography>
        <Typography variant="h2" as="h1" className="mt-2 font-bold text-white">
          Welcome back, {firstName}
        </Typography>
        <Typography variant="body" className="mt-2 max-w-md text-white/90">
          {message}
        </Typography>
        <Button
          variant="secondary"
          size="lg"
          className="mt-6 bg-white text-primary hover:bg-white/90"
          rightIcon={<ArrowRight className="h-4 w-4" />}
        >
          Continue Assessment
        </Button>
      </div>
    </motion.div>
  );
}