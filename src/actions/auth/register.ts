"use server";

import crypto from "crypto";
import { db } from "@/lib/db";
import { hashPassword } from "@/lib/auth/password";
import { registerSchema } from "@/lib/validations/auth";
import { sendVerificationEmail } from "@/lib/email/send";

interface RegisterResult {
  success: boolean;
  error?: string;
}

const VERIFY_TOKEN_TTL_HOURS = 24;

export async function registerUser(formData: unknown): Promise<RegisterResult> {
  const parsed = registerSchema.safeParse(formData);

  if (!parsed.success) {
    return { success: false, error: "Invalid form data" };
  }

  const { firstName, lastName, email, password } = parsed.data;

  const existingUser = await db.user.findUnique({ where: { email } });
  if (existingUser) {
    return { success: false, error: "An account with this email already exists" };
  }

  const passwordHash = await hashPassword(password);

  const user = await db.user.create({
    data: { firstName, lastName, email, passwordHash },
  });

  const token = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + VERIFY_TOKEN_TTL_HOURS * 60 * 60 * 1000);

  await db.emailVerificationToken.create({
    data: { token, userId: user.id, expiresAt },
  });

  const verifyUrl = `${process.env.NEXTAUTH_URL}/verify-email/confirm?token=${token}`;

  const emailResult = await sendVerificationEmail(user.email, user.firstName, verifyUrl);
  if (!emailResult.success) {
    // Account was created and the token exists — the user can still be
    // verified later (e.g. via a resend action in a future task).
    // We don't fail registration just because delivery failed.
    console.error(`Verification email failed to send to ${user.email}: ${emailResult.error}`);
  }

  return { success: true };
}