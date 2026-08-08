"use server";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { hashPassword, verifyPassword } from "@/lib/auth/password";
import { changePasswordSchema } from "@/lib/validations/settings";

interface ActionResult {
  success: boolean;
  error?: string;
}

export async function changePassword(formData: unknown): Promise<ActionResult> {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: "Not authenticated" };
  }

  const parsed = changePasswordSchema.safeParse(formData);
  if (!parsed.success) {
    return { success: false, error: "Invalid data" };
  }

  const user = await db.user.findUnique({ where: { id: session.user.id } });
  if (!user || !user.passwordHash) {
    return { success: false, error: "This account doesn't use a password (signed in with Google)" };
  }

  const isValid = await verifyPassword(parsed.data.currentPassword, user.passwordHash);
  if (!isValid) {
    return { success: false, error: "Current password is incorrect" };
  }

  const newHash = await hashPassword(parsed.data.newPassword);
  await db.user.update({ where: { id: user.id }, data: { passwordHash: newHash } });

  return { success: true };
}