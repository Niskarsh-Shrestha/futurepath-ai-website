import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { ProfileCard } from "@/components/profile/profile-card";

export default async function ProfilePage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: {
      firstName: true,
      lastName: true,
      email: true,
      phone: true,
      country: true,
      timezone: true,
      bio: true,
      image: true,
      role: true,
      createdAt: true,
    },
  });

  if (!user) redirect("/login");

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <ProfileCard user={user} />
    </div>
  );
}