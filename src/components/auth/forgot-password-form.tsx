"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { MailCheck } from "lucide-react";
import { forgotPasswordSchema, type ForgotPasswordInput } from "@/lib/validations/auth";
import { requestPasswordReset } from "@/actions/auth/forgot-password";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Typography } from "@/components/ui/typography";

export function ForgotPasswordForm() {
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  async function onSubmit(data: ForgotPasswordInput) {
    await requestPasswordReset(data);
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center text-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
          <MailCheck className="h-6 w-6 text-primary" aria-hidden="true" />
        </span>
        <Typography variant="title" as="h2" className="mt-4 font-semibold text-foreground">
          Check your email
        </Typography>
        <Typography variant="bodySmall" className="mt-2 max-w-xs leading-relaxed text-muted-foreground">
          If an account exists for that email, we&apos;ve sent a link to reset your password. The
          link expires in 30 minutes.
        </Typography>
        <Link href="/login" className="mt-6 text-sm font-medium text-primary hover:underline">
          Back to login
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      <Input
        label="Email"
        type="email"
        required
        helperText="We'll send a password reset link to this address."
        errorText={errors.email?.message}
        {...register("email")}
      />

      <Button type="submit" variant="primary" size="lg" className="w-full" loading={isSubmitting}>
        Send Reset Link
      </Button>

      <Typography variant="bodySmall" className="text-center text-muted-foreground">
        Remembered your password?{" "}
        <Link href="/login" className="font-medium text-primary hover:underline">
          Login
        </Link>
      </Typography>
    </form>
  );
}