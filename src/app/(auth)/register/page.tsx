import type { Metadata } from "next";
import { RegisterForm } from "@/components/auth/register-form";
import { Typography } from "@/components/ui/typography";

export const metadata: Metadata = {
  title: "Create Account | FuturePath AI",
};

export default function RegisterPage() {
  return (
    <div>
      <div className="mb-6 text-center">
        <Typography variant="h3" as="h1" className="font-bold text-foreground">
          Create your account
        </Typography>
        <Typography variant="bodySmall" className="mt-1.5 text-muted-foreground">
          Start understanding your child&apos;s strengths today.
        </Typography>
      </div>
      <RegisterForm />
    </div>
  );
}