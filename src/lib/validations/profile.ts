import { z } from "zod";

export const updateProfileSchema = z.object({
  firstName: z.string().min(1, "First name is required").max(50),
  lastName: z.string().min(1, "Last name is required").max(50),
  phone: z.string().max(30).optional().or(z.literal("")),
  country: z.string().max(56).optional().or(z.literal("")),
  timezone: z.string().max(56).optional().or(z.literal("")),
  bio: z.string().max(500, "Bio must be under 500 characters").optional().or(z.literal("")),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;

export const avatarUploadSchema = z.object({
  fileName: z.string().min(1),
  fileType: z.enum(["image/jpeg", "image/png", "image/webp"], {
    message: "Only JPEG, PNG, or WebP images are allowed",
  }),
  fileSize: z.number().max(5 * 1024 * 1024, "Image must be under 5MB"),
});

export type AvatarUploadInput = z.infer<typeof avatarUploadSchema>;