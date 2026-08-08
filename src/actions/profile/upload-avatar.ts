"use server";

import { writeFile, mkdir } from "fs/promises";
import path from "path";
import crypto from "crypto";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

interface UploadAvatarResult {
  success: boolean;
  imagePath?: string;
  error?: string;
}

const MAX_SIZE_BYTES = 5 * 1024 * 1024;
const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"];

export async function uploadAvatar(formData: FormData): Promise<UploadAvatarResult> {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: "Not authenticated" };
  }

  const file = formData.get("file") as File | null;
  if (!file) {
    return { success: false, error: "No file provided" };
  }
  if (!ACCEPTED_TYPES.includes(file.type)) {
    return { success: false, error: "Only JPEG, PNG, or WebP images are allowed" };
  }
  if (file.size > MAX_SIZE_BYTES) {
    return { success: false, error: "Image must be under 5MB" };
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const ext = file.type.split("/")[1];
  const fileName = `${session.user.id}-${crypto.randomBytes(6).toString("hex")}.${ext}`;
  const uploadDir = path.join(process.cwd(), "public", "uploads", "avatars");

  await mkdir(uploadDir, { recursive: true });
  await writeFile(path.join(uploadDir, fileName), buffer);

  const imagePath = `/uploads/avatars/${fileName}`;

  await db.user.update({
    where: { id: session.user.id },
    data: { image: imagePath },
  });

  return { success: true, imagePath };
}

interface RemoveAvatarResult {
  success: boolean;
  error?: string;
}

export async function removeAvatar(): Promise<RemoveAvatarResult> {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: "Not authenticated" };
  }

  await db.user.update({
    where: { id: session.user.id },
    data: { image: null },
  });

  return { success: true };
}