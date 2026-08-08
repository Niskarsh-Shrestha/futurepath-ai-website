import Link from "next/link";
import { Mail, Phone, Globe, Clock, Calendar, Pencil, ImagePlus } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Typography } from "@/components/ui/typography";

interface ProfileCardProps {
  user: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string | null;
    country: string | null;
    timezone: string | null;
    bio: string | null;
    image: string | null;
    role: string;
    createdAt: Date;
  };
}

function formatJoinedDate(date: Date): string {
  return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
}

export function ProfileCard({ user }: ProfileCardProps) {
  const fullName = `${user.firstName} ${user.lastName}`;
  const initials = `${user.firstName[0] ?? ""}${user.lastName[0] ?? ""}`.toUpperCase();

  return (
    <Card className="rounded-2xl border border-border bg-white p-7 shadow-sm">
      <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Avatar alt={fullName} fallback={initials} src={user.image ?? undefined} size="xl" />
          <div>
            <Typography variant="h4" as="h1" className="font-bold text-foreground">
              {fullName}
            </Typography>
            <Badge variant="subtle" size="sm" className="mt-1.5">
              {user.role === "ADMIN" ? "Admin" : "Parent"}
            </Badge>
          </div>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" size="sm" leftIcon={<ImagePlus className="h-4 w-4" />} asChild>
            <Link href="/dashboard/profile/edit#avatar">Change Avatar</Link>
          </Button>
          <Button variant="primary" size="sm" leftIcon={<Pencil className="h-4 w-4" />} asChild>
            <Link href="/dashboard/profile/edit">Edit Profile</Link>
          </Button>
        </div>
      </div>

      <div className="mt-7 grid grid-cols-1 gap-4 border-t border-border pt-6 sm:grid-cols-2">
        <InfoRow icon={Mail} label="Email" value={user.email} />
        <InfoRow icon={Phone} label="Phone" value={user.phone || "Not provided"} />
        <InfoRow icon={Globe} label="Country" value={user.country || "Not provided"} />
        <InfoRow icon={Clock} label="Timezone" value={user.timezone || "Not provided"} />
        <InfoRow icon={Calendar} label="Joined" value={formatJoinedDate(user.createdAt)} />
      </div>

      <div className="mt-6 border-t border-border pt-6">
        <Typography variant="caption" className="font-semibold uppercase tracking-wider text-muted-foreground">
          Bio
        </Typography>
        <Typography variant="bodySmall" className="mt-2 leading-relaxed text-foreground">
          {user.bio || "No bio added yet."}
        </Typography>
      </div>
    </Card>
  );
}

function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Mail;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-secondary">
        <Icon className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
      </span>
      <div className="min-w-0">
        <Typography variant="caption" className="text-muted-foreground">
          {label}
        </Typography>
        <Typography variant="bodySmall" className="truncate font-medium text-foreground">
          {value}
        </Typography>
      </div>
    </div>
  );
}