import Link from "next/link";
import { Sparkles } from "lucide-react";
import { Card } from "@/components/ui/card";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-secondary/40 px-4 py-12">
      <div className="w-full max-w-md">
        <Link
          href="/"
          className="mb-8 flex items-center justify-center gap-2.5 text-lg font-bold text-foreground"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
            <Sparkles className="h-4.5 w-4.5 text-primary" aria-hidden="true" />
          </span>
          FuturePath AI
        </Link>
        <Card className="rounded-2xl border border-border bg-white p-8 shadow-sm">{children}</Card>
      </div>
    </div>
  );
}