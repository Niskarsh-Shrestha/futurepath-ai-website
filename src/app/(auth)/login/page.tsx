import type { Metadata } from "next";
import { Suspense } from "react";
import { LoginForm } from "@/components/auth/login-form";
import { Typography } from "@/components/ui/typography";

export const metadata: Metadata = {
  title: "Login | FuturePath AI",
};

export default function LoginPage() {
  return (
    <div>
      <div className="mb-6 text-center">
        <Typography variant="h3" as="h1" className="font-bold text-foreground">
          Welcome back
        </Typography>
        <Typography variant="bodySmall" className="mt-1.5 text-muted-foreground">
          Login to continue your child&apos;s journey.
        </Typography>
      </div>
      <Suspense fallback={null}>
        <LoginForm />
      </Suspense>
    </div>
  );
}