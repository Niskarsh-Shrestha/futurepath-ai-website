"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FcGoogle } from "react-icons/fc";
import { loginSchema, type LoginInput } from "@/lib/validations/auth";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Typography } from "@/components/ui/typography";

const OAUTH_ERROR_MESSAGES: Record<string, string> = {
  OAuthAccountNotLinked: "This email is already registered with a password. Please log in with your email and password instead.",
  OAuthSignin: "Something went wrong starting the Google sign-in. Please try again.",
  OAuthCallback: "Something went wrong completing Google sign-in. Please try again.",
  AccessDenied: "Google sign-in was cancelled.",
};

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [credentialsError, setCredentialsError] = useState<string | null>(null);
  const [googleLoading, setGoogleLoading] = useState(false);

  // Derived directly from the URL during render — no effect needed.
  // OAuth errors arrive as a `?error=` query param after NextAuth
  // redirects back here, so this is available synchronously on render,
  // not something that needs to be "discovered" after mount.
  const errorCode = searchParams.get("error");
  const oauthError = errorCode
    ? (OAUTH_ERROR_MESSAGES[errorCode] ?? "Something went wrong signing in. Please try again.")
    : null;

  // Credentials-login errors genuinely can't be known during render —
  // they only exist after the async onSubmit handler resolves — so
  // this one legitimately needs to be state set from an event handler,
  // not derived. If a credentials error was previously shown and the
  // user retries via Google, the OAuth error (if any) takes over the
  // same banner; both are cleared appropriately by their own flows.
  const serverError = credentialsError ?? oauthError;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { rememberMe: false },
  });

  async function onSubmit(data: LoginInput) {
    setCredentialsError(null);

    const result = await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    });

    if (result?.error) {
      setCredentialsError("Invalid email or password");
      return;
    }

    const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";
    router.push(callbackUrl);
    router.refresh();
  }

  function handleGoogleSignIn() {
    setGoogleLoading(true);
    signIn("google", { callbackUrl: "/dashboard" });
  }

  return (
    <div className="space-y-5">
      {serverError && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3">
          <Typography variant="bodySmall" className="text-destructive">
            {serverError}
          </Typography>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
        <Input
          label="Email"
          type="email"
          required
          errorText={errors.email?.message}
          {...register("email")}
        />

        <div>
          <Input
            label="Password"
            type="password"
            required
            errorText={errors.password?.message}
            {...register("password")}
          />
          <div className="mt-2 text-right">
            <Link href="/forgot-password" className="text-xs font-medium text-primary hover:underline">
              Forgot password?
            </Link>
          </div>
        </div>

        <Button type="submit" variant="primary" size="lg" className="w-full" loading={isSubmitting}>
          Login
        </Button>
      </form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="bg-white px-3 text-muted-foreground">or</span>
        </div>
      </div>

      <Button
        type="button"
        variant="outline"
        size="lg"
        className="w-full"
        leftIcon={<FcGoogle className="h-4 w-4" />}
        loading={googleLoading}
        onClick={handleGoogleSignIn}
      >
        Continue with Google
      </Button>

      <Typography variant="bodySmall" className="text-center text-muted-foreground">
        Don&apos;t have an account?{" "}
        <Link href="/register" className="font-medium text-primary hover:underline">
          Create Account
        </Link>
      </Typography>
    </div>
  );
}