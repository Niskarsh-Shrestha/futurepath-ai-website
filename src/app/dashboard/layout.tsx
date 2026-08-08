import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { DashboardShell } from "@/components/dashboard/layout";
import { ToastProvider } from "@/components/ui/toast";
import { TooltipProvider } from "@/components/ui/tooltip";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <TooltipProvider delayDuration={200}>
      <ToastProvider>
        <DashboardShell userName={session.user.name ?? "there"} userEmail={session.user.email ?? ""}>
          {children}
        </DashboardShell>
      </ToastProvider>
    </TooltipProvider>
  );
}