import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getSubscription } from "@/actions/billing/get-subscription";
import { CurrentPlanCard } from "@/components/billing/current-plan-card";
import { PlansGrid } from "@/components/billing/plans-grid";
import { BillingHistoryList } from "@/components/billing/billing-history";
import { Container } from "@/components/common/container";
import { Typography } from "@/components/ui/typography";

export default async function BillingPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const { subscription } = await getSubscription();

  const plan = subscription?.plan ?? "FREE";
  const status = subscription?.status ?? "ACTIVE";
  const startedAt = subscription?.startedAt ?? new Date();
  const expiresAt = subscription?.expiresAt ?? null;
  const history = subscription?.history ?? [];

  return (
    <Container className="max-w-5xl space-y-8 pb-12">
      <div>
        <Typography
          variant="display"
          as="h1"
          className="font-semibold text-foreground"
        >
          Billing & Subscription
        </Typography>

        <Typography
          variant="body"
          className="mt-2 text-muted-foreground"
        >
          Manage your plan and view billing history.
        </Typography>
      </div>

      <CurrentPlanCard
        plan={plan}
        status={status}
        startedAt={startedAt}
        expiresAt={expiresAt}
      />

      <div>
        <Typography
          variant="title"
          as="h2"
          className="mb-4 font-semibold text-foreground"
        >
          Available Plans
        </Typography>

        <PlansGrid currentPlan={plan} />
      </div>

      <BillingHistoryList history={history} />
    </Container>
  );
}