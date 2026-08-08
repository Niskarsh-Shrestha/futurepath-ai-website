"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

interface DeleteChildResult {
  success: boolean;
  error?: string;
}

export async function deleteChild(childId: string): Promise<DeleteChildResult> {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: "Not authenticated" };
  }

  const existing = await db.child.findUnique({ where: { id: childId } });
  if (!existing || existing.userId !== session.user.id) {
    return { success: false, error: "Child not found" };
  }

  await db.child.delete({ where: { id: childId } });

  revalidatePath("/dashboard/children");
  return { success: true };
}