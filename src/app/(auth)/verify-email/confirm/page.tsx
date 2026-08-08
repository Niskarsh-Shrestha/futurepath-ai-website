import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, XCircle, Clock } from "lucide-react";
import { verifyEmail } from "@/actions/auth/verify-email";
import { Typography } from "@/components/ui/typography";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Email Verification | FuturePath AI",
};

interface ConfirmPageProps {
  searchParams: Promise<{ token?: string }>;
}

export default async function VerifyEmailConfirmPage({ searchParams }: ConfirmPageProps) {
  const { token } = await searchParams;

  const result = token ? await verifyEmail(token) : "invalid";

  if (result === "success") {
    return (
      <div className="flex flex-col items-center text-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-success/10">
          <CheckCircle2 className="h-6 w-6 text-success" aria-hidden="true" />
        </span>
        <Typography variant="title" as="h1" className="mt-4 font-semibold text-foreground">
          Email verified
        </Typography>
        <Typography variant="bodySmall" className="mt-2 max-w-xs leading-relaxed text-muted-foreground">
          Your email has been successfully verified. You can now log in to your account.
        </Typography>
        <Button variant="primary" size="md" className="mt-6" asChild>
          <Link href="/login">Continue to Login</Link>
        </Button>
      </div>
    );
  }

  if (result === "expired") {
    return (
      <div className="flex flex-col items-center text-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-warning/10">
          <Clock className="h-6 w-6 text-warning" aria-hidden="true" />
        </span>
        <Typography variant="title" as="h1" className="mt-4 font-semibold text-foreground">
          Link expired
        </Typography>
        <Typography variant="bodySmall" className="mt-2 max-w-xs leading-relaxed text-muted-foreground">
          This verification link has expired. Please request a new one from your account
          settings after logging in.
        </Typography>
        <Button variant="outline" size="md" className="mt-6" asChild>
          <Link href="/login">Back to Login</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10">
        <XCircle className="h-6 w-6 text-destructive" aria-hidden="true" />
      </span>
      <Typography variant="title" as="h1" className="mt-4 font-semibold text-foreground">
        Verification failed
      </Typography>
      <Typography variant="bodySmall" className="mt-2 max-w-xs leading-relaxed text-muted-foreground">
        This verification link is invalid or has already been used.
      </Typography>
      <Button variant="outline" size="md" className="mt-6" asChild>
        <Link href="/login">Back to Login</Link>
      </Button>
    </div>
  );
}