"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { notificationSettingsSchema } from "@/lib/validations/settings";

interface ActionResult {
  success: boolean;
  error?: string;
}

export async function updateNotificationSettings(formData: unknown): Promise<ActionResult> {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: "Not authenticated" };
  }

  const parsed = notificationSettingsSchema.safeParse(formData);
  if (!parsed.success) {
    return { success: false, error: "Invalid data" };
  }

  await db.user.update({
    where: { id: session.user.id },
    data: parsed.data,
  });

  revalidatePath("/dashboard/settings");
  return { success: true };
}