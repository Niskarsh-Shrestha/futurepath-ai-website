"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { childSchema, type ChildInput, LEARNING_STYLES, GENDERS } from "@/lib/validations/child";
import { createChild } from "@/actions/children/create-child";
import { updateChild } from "@/actions/children/update-child";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { TagInput } from "@/components/ui/tag-input";
import { useToast } from "@/components/ui/toast";

interface ChildFormProps {
  childId?: string;
  defaultValues?: ChildInput;
}

export function ChildForm({ childId, defaultValues }: ChildFormProps) {
  const router = useRouter();
  const { showToast } = useToast();
  const isEditing = Boolean(childId);
  const cancelHref = isEditing ? `/dashboard/children/${childId}` : "/dashboard/children";

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<ChildInput>({
    resolver: zodResolver(childSchema),
    defaultValues: defaultValues ?? {
      firstName: "",
      lastName: "",
      dateOfBirth: "",
      school: "",
      grade: "",
      country: "",
      interests: [],
      strengths: [],
    },
  });

  async function onSubmit(data: ChildInput) {
    const result = isEditing ? await updateChild(childId as string, data) : await createChild(data);

    if (!result.success) {
      showToast(result.error ?? "Something went wrong", "error");
      return;
    }

    showToast(isEditing ? "Child updated successfully" : "Child added successfully");
    router.push(isEditing ? `/dashboard/children/${childId}` : "/dashboard/children");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input label="First name" required errorText={errors.firstName?.message} {...register("firstName")} />
        <Input label="Last name" required errorText={errors.lastName?.message} {...register("lastName")} />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input
          label="Date of birth"
          type="date"
          required
          errorText={errors.dateOfBirth?.message}
          {...register("dateOfBirth")}
        />
        <div className="w-full space-y-1.5">
          <label className="text-sm font-medium leading-none text-foreground">Gender</label>
          <select
            {...register("gender")}
            className="flex h-10 w-full rounded-lg border border-input bg-white px-3 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <option value="">Select gender</option>
            {GENDERS.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input label="School" errorText={errors.school?.message} {...register("school")} />
        <Input label="Grade" errorText={errors.grade?.message} {...register("grade")} />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input label="Country" errorText={errors.country?.message} {...register("country")} />
        <div className="w-full space-y-1.5">
          <label className="text-sm font-medium leading-none text-foreground">Learning style</label>
          <select
            {...register("learningStyle")}
            className="flex h-10 w-full rounded-lg border border-input bg-white px-3 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <option value="">Select learning style</option>
            {LEARNING_STYLES.map((style) => (
              <option key={style} value={style}>
                {style}
              </option>
            ))}
          </select>
        </div>
      </div>

      <Controller
        name="interests"
        control={control}
        render={({ field }) => (
          <TagInput
            label="Interests"
            value={field.value}
            onChange={field.onChange}
            placeholder="e.g. drawing, robotics, football"
            errorText={errors.interests?.message}
          />
        )}
      />

      <Controller
        name="strengths"
        control={control}
        render={({ field }) => (
          <TagInput
            label="Strengths"
            value={field.value}
            onChange={field.onChange}
            placeholder="e.g. problem solving, creativity"
            errorText={errors.strengths?.message}
          />
        )}
      />

      <div className="flex gap-3 border-t border-border pt-6">
        <Button type="submit" variant="primary" size="lg" loading={isSubmitting}>
          {isEditing ? "Save Changes" : "Add Child"}
        </Button>
        <Button type="button" variant="outline" size="lg" asChild>
          <Link href={cancelHref}>Cancel</Link>
        </Button>
      </div>
    </form>
  );
}