"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Typography } from "@/components/ui/typography";
import { cn } from "@/lib/utils";

interface ReportSectionProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

export function ReportSection({ title, description, children, defaultOpen = true }: ReportSectionProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <Card className="overflow-hidden rounded-2xl border border-border bg-white shadow-sm">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-3 p-6 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <div>
          <Typography variant="title" as="h2" className="font-semibold text-foreground">
            {title}
          </Typography>
          {description && (
            <Typography variant="bodySmall" className="mt-1 text-muted-foreground">
              {description}
            </Typography>
          )}
        </div>
        <ChevronDown
          className={cn("h-5 w-5 shrink-0 text-muted-foreground transition-transform duration-200", open && "rotate-180")}
          aria-hidden="true"
        />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="overflow-hidden"
          >
            <div className="border-t border-border px-6 pb-6 pt-5">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}