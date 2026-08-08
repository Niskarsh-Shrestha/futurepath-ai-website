"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { childSchema } from "@/lib/validations/child";

interface ChildActionResult {
  success: boolean;
  error?: string;
  childId?: string;
}

export async function createChild(formData: unknown): Promise<ChildActionResult> {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: "Not authenticated" };
  }

  const parsed = childSchema.safeParse(formData);
  if (!parsed.success) {
    return { success: false, error: "Invalid form data" };
  }

  const { dateOfBirth, ...rest } = parsed.data;

  const child = await db.child.create({
    data: {
      ...rest,
      dateOfBirth: new Date(dateOfBirth),
      userId: session.user.id,
    },
  });

  revalidatePath("/dashboard/children");
  return { success: true, childId: child.id };
}