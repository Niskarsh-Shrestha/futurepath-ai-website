"use server";

import { db } from "@/lib/db";

type VerifyEmailResult = "success" | "expired" | "invalid";

export async function verifyEmail(token: string): Promise<VerifyEmailResult> {
  const verificationToken = await db.emailVerificationToken.findUnique({
    where: { token },
  });

  if (!verificationToken) {
    return "invalid";
  }

  if (verificationToken.expiresAt < new Date()) {
    await db.emailVerificationToken.delete({ where: { id: verificationToken.id } });
    return "expired";
  }

  await db.$transaction([
    db.user.update({
      where: { id: verificationToken.userId },
      data: { emailVerified: new Date() },
    }),
    db.emailVerificationToken.deleteMany({
      where: { userId: verificationToken.userId },
    }),
  ]);

  return "success";
}