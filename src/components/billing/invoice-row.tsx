import { Badge } from "@/components/ui/badge";
import { Typography } from "@/components/ui/typography";
import type { Plan } from "@prisma/client";

const PLAN_LABELS: Record<Plan, string> = {
  FREE: "Free",
  PREMIUM_MONTHLY: "Premium (Monthly)",
  PREMIUM_ANNUAL: "Premium (Annual)",
};

function getStatusBadgeVariant(status: string): "success" | "outline" | "subtle" {
  switch (status) {
    case "PAID":
      return "success";
    case "CANCELLED":
      return "outline";
    default:
      return "subtle";
  }
}

export interface InvoiceRowData {
  id: string;
  plan: Plan;
  amount: number;
  status: string;
  createdAt: Date;
}

interface InvoiceRowProps {
  entry: InvoiceRowData;
}

function formatDate(date: Date): string {
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function formatAmount(amount: number): string {
  return amount === 0 ? "—" : `$${amount.toFixed(2)}`;
}

export function InvoiceRow({ entry }: InvoiceRowProps) {
  return (
    <tr className="border-b border-border last:border-0">
      <td className="px-4 py-3">
        <Typography variant="bodySmall" className="text-foreground">{formatDate(entry.createdAt)}</Typography>
      </td>
      <td className="px-4 py-3">
        <Typography variant="bodySmall" className="text-foreground">{PLAN_LABELS[entry.plan]}</Typography>
      </td>
      <td className="px-4 py-3">
        <Typography variant="bodySmall" className="font-medium text-foreground">{formatAmount(entry.amount)}</Typography>
      </td>
      <td className="px-4 py-3">
        <Badge variant={getStatusBadgeVariant(entry.status)} size="sm">{entry.status}</Badge>
      </td>
    </tr>
  );
}