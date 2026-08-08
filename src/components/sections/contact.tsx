"use client";

import { motion } from "framer-motion";
import { Mail } from "lucide-react";
import { FaXTwitter, FaLinkedinIn, FaInstagram } from "react-icons/fa6";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Typography } from "@/components/ui/typography";
import { Container } from "@/components/common/container";

const SOCIALS = [
  { icon: FaXTwitter, label: "Twitter", href: "#" },
  { icon: FaLinkedinIn, label: "LinkedIn", href: "#" },
  { icon: FaInstagram, label: "Instagram", href: "#" },
];

export function Contact() {
  return (
    <section id="contact" className="bg-secondary/40 py-24 md:py-32">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-2xl text-center"
        >
          <Typography variant="overline" className="text-primary">
            Contact
          </Typography>
          <Typography variant="h2" as="h2" className="mt-3 font-bold text-foreground">
            We&apos;d love to hear from you
          </Typography>
          <Typography variant="subtitle" as="p" className="mt-4 leading-relaxed text-muted-foreground">
            Questions about FuturePath AI? Reach out and our team will get back to you.
          </Typography>
        </motion.div>

        <div className="mx-auto mt-14 grid max-w-4xl grid-cols-1 gap-6 md:grid-cols-5">
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="md:col-span-2"
          >
            <Card className="flex h-full flex-col justify-between rounded-2xl border border-border bg-white p-7 shadow-sm">
              <div>
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10">
                  <Mail className="h-5 w-5 text-primary" aria-hidden="true" />
                </span>
                <Typography variant="title" as="h3" className="mt-4 font-semibold text-foreground">
                  Email us
                </Typography>
                <Typography variant="bodySmall" className="mt-1 text-muted-foreground">
                  hello@futurepath.ai
                </Typography>
              </div>

              <div className="mt-8 flex gap-3">
                {SOCIALS.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    aria-label={social.label}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-white text-muted-foreground transition-colors hover:border-primary/30 hover:bg-primary/10 hover:text-primary"
                  >
                    <social.icon className="h-4 w-4" aria-hidden="true" />
                  </a>
                ))}
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="md:col-span-3"
          >
            <Card className="rounded-2xl border border-border bg-white p-7 shadow-sm">
              <form
                className="space-y-5"
                onSubmit={(e) => e.preventDefault()}
                aria-label="Contact form (UI only, not yet connected)"
              >
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <Input label="Name" placeholder="Your name" required />
                  <Input label="Email" type="email" placeholder="you@example.com" required />
                </div>
                <Textarea label="Message" placeholder="How can we help?" required />
                <Button type="submit" variant="primary" size="lg" className="w-full sm:w-auto">
                  Send Message
                </Button>
              </form>
            </Card>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}