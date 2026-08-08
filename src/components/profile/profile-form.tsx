"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { updateProfileSchema, type UpdateProfileInput } from "@/lib/validations/profile";
import { updateProfile } from "@/actions/profile/update-profile";
import { uploadAvatar, removeAvatar } from "@/actions/profile/upload-avatar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { AvatarUpload, type AvatarSelection } from "@/components/profile/avatar-upload";
import { useToast } from "@/components/ui/toast";

interface ProfileFormProps {
  defaultValues: UpdateProfileInput;
  currentImage: string | null;
  fallback: string;
}

export function ProfileForm({ defaultValues, currentImage, fallback }: ProfileFormProps) {
  const router = useRouter();
  const { showToast } = useToast();
  const [avatarSelection, setAvatarSelection] = useState<AvatarSelection>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<UpdateProfileInput>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues,
  });

  async function onSubmit(data: UpdateProfileInput) {
    if (avatarSelection instanceof File) {
      const formData = new FormData();
      formData.append("file", avatarSelection);
      const avatarResult = await uploadAvatar(formData);
      if (!avatarResult.success) {
        showToast(avatarResult.error ?? "Failed to upload avatar", "error");
        return;
      }
    } else if (avatarSelection === "remove") {
      const avatarResult = await removeAvatar();
      if (!avatarResult.success) {
        showToast(avatarResult.error ?? "Failed to remove avatar", "error");
        return;
      }
    }

    const result = await updateProfile(data);
    if (!result.success) {
      showToast(result.error ?? "Failed to update profile", "error");
      return;
    }

    showToast("Profile updated successfully");
    router.push("/dashboard/profile");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
      <AvatarUpload currentImage={currentImage} fallback={fallback} onSelectionChange={setAvatarSelection} />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input label="First name" required errorText={errors.firstName?.message} {...register("firstName")} />
        <Input label="Last name" required errorText={errors.lastName?.message} {...register("lastName")} />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input label="Phone" type="tel" errorText={errors.phone?.message} {...register("phone")} />
        <Input label="Country" errorText={errors.country?.message} {...register("country")} />
      </div>

      <Input
        label="Timezone"
        placeholder="e.g. Australia/Adelaide"
        errorText={errors.timezone?.message}
        {...register("timezone")}
      />

      <Textarea
        label="Bio"
        placeholder="Tell us a little about yourself"
        helperText="Max 500 characters"
        errorText={errors.bio?.message}
        {...register("bio")}
      />

      <div className="flex gap-3 border-t border-border pt-6">
        <Button type="submit" variant="primary" size="lg" loading={isSubmitting}>
          Save Changes
        </Button>
        <Button type="button" variant="outline" size="lg" asChild>
          <Link href="/dashboard/profile">Cancel</Link>
        </Button>
      </div>
    </form>
  );
}