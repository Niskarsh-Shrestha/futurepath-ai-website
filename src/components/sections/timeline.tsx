"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Typography } from "@/components/ui/typography";
import { Container } from "@/components/common/container";

const TIMELINE = [
  { age: "Age 5", description: "Early interests and play patterns begin shaping the profile." },
  { age: "Age 8", description: "Learning style and favourite subjects become clearer." },
  { age: "Age 12", description: "Strengths and extracurricular interests sharpen the roadmap." },
  { age: "Age 16", description: "Career-relevant skills and goals take shape." },
  { age: "Future Career", description: "Years of data converge into confident, explainable direction." },
];

export function Timeline() {
  return (
    <section id="timeline" className="py-24 md:py-32">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-2xl text-center"
        >
          <Typography variant="overline" className="text-primary">
            Growth Timeline
          </Typography>
          <Typography variant="h2" as="h2" className="mt-3 font-bold text-foreground">
            Recommendations evolve as your child does
          </Typography>
        </motion.div>

        <div className="relative mx-auto mt-20 max-w-3xl">
          <div
            className="absolute left-4 top-0 h-full w-px bg-border md:left-1/2 md:-translate-x-1/2"
            aria-hidden="true"
          />
          <ol className="space-y-10">
            {TIMELINE.map((item, index) => {
              const alignLeft = index % 2 === 0;
              return (
                <motion.li
                  key={item.age}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  className="relative pl-12 md:grid md:grid-cols-2 md:gap-8 md:pl-0"
                >
                  <span
                    className="absolute left-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-full border-2 border-primary bg-white md:left-1/2 md:-translate-x-1/2"
                    aria-hidden="true"
                  >
                    <span className="h-2 w-2 rounded-full bg-primary" />
                  </span>
                  <div className={alignLeft ? "md:pr-8 md:text-right" : "md:col-start-2 md:pl-8"}>
                    <Card className="inline-block rounded-2xl border border-border bg-white p-6 text-left shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                      <Typography variant="title" as="h3" className="font-bold text-primary">
                        {item.age}
                      </Typography>
                      <Typography variant="bodySmall" className="mt-1.5 leading-relaxed text-muted-foreground">
                        {item.description}
                      </Typography>
                    </Card>
                  </div>
                </motion.li>
              );
            })}
          </ol>
        </div>
      </Container>
    </section>
  );
}