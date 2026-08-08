import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { ProfileForm } from "@/components/profile/profile-form";
import { Card } from "@/components/ui/card";
import { Typography } from "@/components/ui/typography";

export default async function EditProfilePage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: { firstName: true, lastName: true, phone: true, country: true, timezone: true, bio: true, image: true },
  });

  if (!user) redirect("/login");

  const fallback = `${user.firstName[0] ?? ""}${user.lastName[0] ?? ""}`.toUpperCase();

  return (
    <div className="mx-auto max-w-2xl">
      <Typography variant="h3" as="h1" className="font-bold text-foreground">
        Edit Profile
      </Typography>
      <Card className="mt-6 rounded-2xl border border-border bg-white p-7 shadow-sm">
        <ProfileForm
          defaultValues={{
            firstName: user.firstName,
            lastName: user.lastName,
            phone: user.phone ?? "",
            country: user.country ?? "",
            timezone: user.timezone ?? "",
            bio: user.bio ?? "",
          }}
          currentImage={user.image}
          fallback={fallback}
        />
      </Card>
    </div>
  );
}