import type { Metadata } from "next";
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";
import { Typography } from "@/components/ui/typography";

export const metadata: Metadata = {
  title: "Forgot Password | FuturePath AI",
};

export default function ForgotPasswordPage() {
  return (
    <div>
      <div className="mb-6 text-center">
        <Typography variant="h3" as="h1" className="font-bold text-foreground">
          Forgot your password?
        </Typography>
        <Typography variant="bodySmall" className="mt-1.5 text-muted-foreground">
          Enter your email and we&apos;ll send you a reset link.
        </Typography>
      </div>
      <ForgotPasswordForm />
    </div>
  );
}