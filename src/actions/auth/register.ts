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
    console.log("[Register] Validation failed:", parsed.error.flatten());
    return { success: false, error: "Invalid form data" };
  }

  const { firstName, lastName, email, password } = parsed.data;

  console.log("[Register] Attempting registration for email:", JSON.stringify(email));
  console.log("[Register] DATABASE_URL host (redacted):", process.env.DATABASE_URL?.split("@")[1]?.split("/")[0]);

  try {
    const existingUser = await db.user.findUnique({ where: { email } });
    console.log("[Register] findUnique result:", existingUser ? { id: existingUser.id, email: existingUser.email, createdAt: existingUser.createdAt } : null);

    if (existingUser) {
      return { success: false, error: "An account with this email already exists" };
    }

    const passwordHash = await hashPassword(password);

    const user = await db.user.create({
      data: { firstName, lastName, email, passwordHash },
    });
    console.log("[Register] User created:", user.id, user.email);

    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + VERIFY_TOKEN_TTL_HOURS * 60 * 60 * 1000);

    await db.emailVerificationToken.create({
      data: { token, userId: user.id, expiresAt },
    });

    const verifyUrl = `${process.env.NEXTAUTH_URL}/verify-email/confirm?token=${token}`;

    try {
      const emailResult = await sendVerificationEmail(user.email, user.firstName, verifyUrl);
      if (!emailResult.success) {
        console.error(`Verification email failed to send to ${user.email}: ${emailResult.error}`);
      }
    } catch (emailErr) {
      console.error("[Register] Email sending threw unexpectedly:", emailErr);
    }

    return { success: true };
  } catch (err) {
    console.error("[Register] Registration failed:", err);
    return {
      success: false,
      error: "Something went wrong creating your account. Please try again in a moment.",
    };
  }
}