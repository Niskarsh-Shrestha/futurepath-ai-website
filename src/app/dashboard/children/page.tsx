import Link from "next/link";
import { redirect } from "next/navigation";
import { Plus } from "lucide-react";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { ChildrenGrid } from "@/components/children/children-grid";
import { Button } from "@/components/ui/button";
import { Typography } from "@/components/ui/typography";

export default async function ChildrenPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const children = await db.child.findMany({
    where: {
      userId: session.user.id,
    },

    orderBy: {
      createdAt: "asc",
    },

    select: {
      id: true,
      firstName: true,
      lastName: true,
      dateOfBirth: true,
      school: true,
      grade: true,
      interests: true,
      profileImage: true,
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Typography
            variant="title"
            as="h1"
            className="font-semibold text-foreground"
          >
            Children
          </Typography>

          <Typography
            variant="body"
            className="mt-1 text-muted-foreground"
          >
            Manage your children's profiles.
          </Typography>
        </div>

        {children.length > 0 && (
          <Button
            variant="primary"
            size="md"
            leftIcon={<Plus className="h-4 w-4" />}
            asChild
          >
            <Link href="/dashboard/children/new">
              Add Child
            </Link>
          </Button>
        )}
      </div>

      <ChildrenGrid children={children} />
    </div>
  );
}