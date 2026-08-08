"use client";

import { motion } from "framer-motion";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Typography } from "@/components/ui/typography";
import { Container } from "@/components/common/container";

const FAQS = [
  {
    question: "How does the AI generate recommendations?",
    answer:
      "The AI analyses the interests, behaviour, and learning preferences you enter over time and looks for patterns. Every recommendation comes with a plain-language explanation of why it was made.",
  },
  {
    question: "Is my child's data kept private?",
    answer:
      "Yes. Child profile data is only visible to the parent account that created it and is never sold or shared with third parties for advertising.",
  },
  {
    question: "How is my data secured?",
    answer:
      "Data is encrypted in transit and at rest, with access controls limiting who can view or modify a profile.",
  },
  {
    question: "Can I cancel my subscription anytime?",
    answer:
      "Yes, Premium subscriptions can be cancelled at any time from your account settings, with no cancellation fees.",
  },
  {
    question: "What age range does FuturePath AI support?",
    answer:
      "FuturePath AI is designed for children and teens aged 5 to 18, with recommendations that adapt as they grow.",
  },
  {
    question: "Can schools or counsellors use FuturePath AI?",
    answer:
      "Yes — schools, tutoring centres, and career counsellors can use FuturePath AI's reports to support the guidance they already provide.",
  },
];

export function Faq() {
  return (
    <section id="faq" className="py-24 md:py-32">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-2xl text-center"
        >
          <Typography variant="overline" className="text-primary">
            FAQ
          </Typography>
          <Typography variant="h2" as="h2" className="mt-3 font-bold text-foreground">
            Frequently asked questions
          </Typography>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mx-auto mt-14 max-w-2xl"
        >
          <Accordion type="single" collapsible className="space-y-3">
            {FAQS.map((faq) => (
              <AccordionItem key={faq.question} value={faq.question}>
                <AccordionTrigger>{faq.question}</AccordionTrigger>
                <AccordionContent>{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </Container>
    </section>
  );
}