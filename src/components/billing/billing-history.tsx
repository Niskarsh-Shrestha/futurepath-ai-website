import { Receipt } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Typography } from "@/components/ui/typography";
import { EmptyState } from "@/components/ui/empty-state";
import { InvoiceRow, type InvoiceRowData } from "@/components/billing/invoice-row";

interface BillingHistoryListProps {
  history: InvoiceRowData[];
}

export function BillingHistoryList({ history }: BillingHistoryListProps) {
  return (
    <Card className="rounded-2xl border border-border bg-white p-6 shadow-sm">
      <Typography variant="title" as="h2" className="font-semibold text-foreground">
        Billing History
      </Typography>

      {history.length === 0 ? (
        <EmptyState
          icon={Receipt}
          title="No billing history yet"
          description="Your plan changes and payments will appear here."
        />
      ) : (
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-border">
                <th className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Date</th>
                <th className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Plan</th>
                <th className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Amount</th>
                <th className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Status</th>
              </tr>
            </thead>
            <tbody>
              {history.map((entry) => (
                <InvoiceRow key={entry.id} entry={entry} />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  );
}