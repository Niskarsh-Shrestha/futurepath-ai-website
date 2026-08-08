"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Check } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Typography } from "@/components/ui/typography";
import { Container } from "@/components/common/container";
import { cn } from "@/lib/utils";

const PLANS = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Get started and explore the basics.",
    features: ["1 child profile", "Basic interest tracking", "Monthly summary report", "Community support"],
    cta: "Get Started",
    highlighted: false,
  },
  {
    name: "Premium Monthly",
    price: "$9.99",
    period: "/month",
    description: "Full access, billed monthly.",
    features: [
      "Up to 5 child profiles",
      "Full AI analysis & roadmaps",
      "Career recommendations",
      "AI chatbot access",
      "Priority support",
    ],
    cta: "Start Free Trial",
    highlighted: true,
  },
  {
    name: "Premium Annual",
    price: "$89.99",
    period: "/year",
    description: "Same as monthly, 2 months free.",
    features: [
      "Up to 5 child profiles",
      "Full AI analysis & roadmaps",
      "Career recommendations",
      "AI chatbot access",
      "Priority support",
      "Annual growth report",
    ],
    cta: "Start Free Trial",
    highlighted: false,
  },
];

export function Pricing() {
  return (
    <section id="pricing" className="bg-secondary/40 py-24 md:py-32">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-2xl text-center"
        >
          <Typography variant="overline" className="text-primary">
            Pricing
          </Typography>
          <Typography variant="h2" as="h2" className="mt-3 font-bold text-foreground">
            Simple, transparent pricing
          </Typography>
          <Typography variant="subtitle" as="p" className="mt-4 leading-relaxed text-muted-foreground">
            Start free. Upgrade whenever you&apos;re ready for deeper insights.
          </Typography>
        </motion.div>

        <div className="mt-16 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {PLANS.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <Card
                className={cn(
                  "relative flex h-full flex-col rounded-2xl border bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg",
                  plan.highlighted ? "border-primary shadow-md" : "border-border"
                )}
              >
                {plan.highlighted && (
                  <Badge variant="primary" size="md" className="absolute -top-3 left-1/2 -translate-x-1/2">
                    Most Popular
                  </Badge>
                )}

                <Typography variant="title" as="h3" className="font-semibold text-foreground">
                  {plan.name}
                </Typography>
                <Typography variant="bodySmall" className="mt-1 text-muted-foreground">
                  {plan.description}
                </Typography>

                <div className="mt-6 flex items-baseline gap-1">
                  <Typography variant="display" as="span" className="text-4xl font-bold text-foreground">
                    {plan.price}
                  </Typography>
                  <Typography variant="bodySmall" className="text-muted-foreground">
                    {plan.period}
                  </Typography>
                </div>

                <ul className="mt-6 flex-1 space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2.5">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                      <Typography variant="bodySmall" className="text-foreground">
                        {feature}
                      </Typography>
                    </li>
                  ))}
                </ul>

                <Button
                  variant={plan.highlighted ? "primary" : "outline"}
                  size="lg"
                  className="mt-8 w-full"
                  asChild
                >
                  <Link href="/dashboard/billing">{plan.cta}</Link>
                </Button>
              </Card>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}