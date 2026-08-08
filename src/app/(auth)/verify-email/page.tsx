import type { Metadata } from "next";
import { MailCheck } from "lucide-react";
import { Typography } from "@/components/ui/typography";

export const metadata: Metadata = {
  title: "Verify Your Email | FuturePath AI",
};

export default function VerifyEmailPendingPage() {
  return (
    <div className="flex flex-col items-center text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
        <MailCheck className="h-6 w-6 text-primary" aria-hidden="true" />
      </span>
      <Typography variant="title" as="h1" className="mt-4 font-semibold text-foreground">
        Verify your email
      </Typography>
      <Typography variant="bodySmall" className="mt-2 max-w-xs leading-relaxed text-muted-foreground">
        We&apos;ve sent a verification link to your email address. Click the link to activate
        your account.
      </Typography>
    </div>
  );
}