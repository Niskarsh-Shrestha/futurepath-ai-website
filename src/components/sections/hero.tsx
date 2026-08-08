"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Typography } from "@/components/ui/typography";
import { Container } from "@/components/common/container";
import { ProductShowcase } from "@/components/sections/product-showcase";

export function Hero() {
  return (
    <section id="home" className="relative overflow-hidden pb-24 pt-32 md:pb-32 md:pt-40">
      <div
        className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-primary/[0.07] via-white to-white"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute left-1/2 top-0 -z-10 h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-primary/15 blur-3xl"
        aria-hidden="true"
      />

      <Container className="flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-white px-4 py-1.5 text-sm font-medium text-muted-foreground shadow-sm"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-primary" aria-hidden="true" />
          Powered by AI that grows with your child
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="max-w-3xl text-4xl font-bold tracking-tight text-foreground md:text-6xl"
        >
          Discover your child&apos;s strengths before the world does.
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Typography
            variant="subtitle"
            as="p"
            className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg"
          >
            FuturePath AI continuously learns from your child&apos;s interests and behaviour to
            build learning roadmaps and career guidance that evolve as they grow.
          </Typography>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-10 flex flex-col gap-3 sm:flex-row"
        >
          <Button variant="primary" size="xl" rightIcon={<ArrowRight className="h-4 w-4" />} asChild>
            <Link href="/register">Get Started Free</Link>
          </Button>
          <Button variant="outline" size="xl" leftIcon={<Play className="h-4 w-4" />} asChild>
            <Link href="#how-it-works">See How It Works</Link>
          </Button>
        </motion.div>

        <div className="mt-20 flex w-full justify-center">
          <ProductShowcase />
        </div>
      </Container>
    </section>
  );
}