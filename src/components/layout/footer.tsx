import Link from "next/link";
import { Sparkles } from "lucide-react";
import { FaXTwitter, FaLinkedinIn, FaInstagram } from "react-icons/fa6";
import { Typography } from "@/components/ui/typography";
import { Container } from "@/components/common/container";

const FOOTER_LINKS = {
  Company: [
    { label: "About", href: "#" },
    { label: "Careers", href: "#" },
    { label: "Blog", href: "#" },
  ],
  Resources: [
    { label: "Help Centre", href: "#" },
    { label: "For Schools", href: "#" },
    { label: "For Counsellors", href: "#" },
  ],
  Legal: [
    { label: "Privacy Policy", href: "#" },
    { label: "Terms of Service", href: "#" },
    { label: "Cookie Policy", href: "#" },
  ],
};

const SOCIALS = [
  { icon: FaXTwitter, label: "Twitter", href: "#" },
  { icon: FaLinkedinIn, label: "LinkedIn", href: "#" },
  { icon: FaInstagram, label: "Instagram", href: "#" },
];

export function Footer() {
  return (
    <footer className="border-t border-border bg-white">
      <Container className="py-16">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-5">
          <div className="md:col-span-2">
            <Link href="#home" className="flex items-center gap-2.5 text-lg font-bold text-foreground">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
                <Sparkles className="h-4.5 w-4.5 text-primary" aria-hidden="true" />
              </span>
              FuturePath AI
            </Link>
            <Typography variant="bodySmall" className="mt-4 max-w-xs leading-relaxed text-muted-foreground">
              Helping parents discover, understand, and nurture their child&apos;s strengths using
              explainable AI.
            </Typography>
            <div className="mt-6 flex gap-3">
              {SOCIALS.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-white text-muted-foreground transition-colors hover:border-primary/30 hover:bg-primary/10 hover:text-primary"
                >
                  <social.icon className="h-3.5 w-3.5" aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>

          {Object.entries(FOOTER_LINKS).map(([heading, links]) => (
            <div key={heading}>
              <Typography variant="caption" className="font-semibold uppercase tracking-wider text-foreground">
                {heading}
              </Typography>
              <ul className="mt-4 space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-primary"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 flex flex-col items-center gap-4 border-t border-border pt-8 sm:flex-row sm:justify-between">
          <Typography variant="caption" className="text-muted-foreground">
            © {new Date().getFullYear()} FuturePath AI. All rights reserved.
          </Typography>
          <Typography variant="caption" className="text-muted-foreground">
            Built for parents, by people who care about children&apos;s futures.
          </Typography>
        </div>
      </Container>
    </footer>
  );
}