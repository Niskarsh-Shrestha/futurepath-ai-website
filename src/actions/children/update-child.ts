"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { childSchema } from "@/lib/validations/child";

interface ChildActionResult {
  success: boolean;
  error?: string;
}

export async function updateChild(childId: string, formData: unknown): Promise<ChildActionResult> {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: "Not authenticated" };
  }

  const existing = await db.child.findUnique({ where: { id: childId } });
  if (!existing || existing.userId !== session.user.id) {
    return { success: false, error: "Child not found" };
  }

  const parsed = childSchema.safeParse(formData);
  if (!parsed.success) {
    return { success: false, error: "Invalid form data" };
  }

  const { dateOfBirth, ...rest } = parsed.data;

  await db.child.update({
    where: { id: childId },
    data: { ...rest, dateOfBirth: new Date(dateOfBirth) },
  });

  revalidatePath("/dashboard/children");
  revalidatePath(`/dashboard/children/${childId}`);
  return { success: true };
}