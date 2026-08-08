import type { Metadata } from "next";
import Link from "next/link";
import { AlertTriangle } from "lucide-react";
import { validateResetToken } from "@/actions/auth/reset-password";
import { ResetPasswordForm } from "@/components/auth/reset-password-form";
import { Typography } from "@/components/ui/typography";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Reset Password | FuturePath AI",
};

interface ResetPasswordPageProps {
  searchParams: Promise<{ token?: string }>;
}

export default async function ResetPasswordPage({ searchParams }: ResetPasswordPageProps) {
  const { token } = await searchParams;

  const isValid = token ? await validateResetToken(token) : false;

  if (!token || !isValid) {
    return (
      <div className="flex flex-col items-center text-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10">
          <AlertTriangle className="h-6 w-6 text-destructive" aria-hidden="true" />
        </span>
        <Typography variant="title" as="h2" className="mt-4 font-semibold text-foreground">
          Link expired or invalid
        </Typography>
        <Typography variant="bodySmall" className="mt-2 max-w-xs leading-relaxed text-muted-foreground">
          This password reset link is no longer valid. Please request a new one.
        </Typography>
        <Button variant="primary" size="md" className="mt-6" asChild>
          <Link href="/forgot-password">Request New Link</Link>
        </Button>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 text-center">
        <Typography variant="h3" as="h1" className="font-bold text-foreground">
          Set a new password
        </Typography>
        <Typography variant="bodySmall" className="mt-1.5 text-muted-foreground">
          Choose a strong password for your account.
        </Typography>
      </div>
      <ResetPasswordForm token={token} />
    </div>
  );
}