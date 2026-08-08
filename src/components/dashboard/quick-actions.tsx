"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Typography } from "@/components/ui/typography";
import { QUICK_ACTIONS } from "@/lib/dashboard/quick-actions";

export function QuickActions() {
  return (
    <div>
      <Typography variant="title" as="h2" className="font-semibold text-foreground">
        Quick Actions
      </Typography>
      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {QUICK_ACTIONS.map((action, index) => (
          <motion.div
            key={action.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.06 }}
          >
            <Link href={action.href}>
              <Card className="group h-full rounded-2xl border border-border bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                <div className="flex items-start justify-between">
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 transition-transform duration-300 group-hover:scale-110">
                    <action.icon className="h-5 w-5 text-primary" aria-hidden="true" />
                  </span>
                  <ArrowUpRight
                    className="h-4 w-4 text-muted-foreground opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                    aria-hidden="true"
                  />
                </div>
                <Typography variant="title" as="h3" className="mt-4 font-semibold text-foreground">
                  {action.title}
                </Typography>
                <Typography variant="bodySmall" className="mt-1.5 leading-relaxed text-muted-foreground">
                  {action.description}
                </Typography>
              </Card>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}