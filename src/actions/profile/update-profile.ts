"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { updateProfileSchema } from "@/lib/validations/profile";

interface UpdateProfileResult {
  success: boolean;
  error?: string;
}

export async function updateProfile(formData: unknown): Promise<UpdateProfileResult> {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: "Not authenticated" };
  }

  const parsed = updateProfileSchema.safeParse(formData);
  if (!parsed.success) {
    return { success: false, error: "Invalid form data" };
  }

  const { firstName, lastName, phone, country, timezone, bio } = parsed.data;

  await db.user.update({
    where: { id: session.user.id },
    data: {
      firstName,
      lastName,
      phone: phone || null,
      country: country || null,
      timezone: timezone || null,
      bio: bio || null,
    },
  });

  revalidatePath("/dashboard/profile");
  return { success: true };
}