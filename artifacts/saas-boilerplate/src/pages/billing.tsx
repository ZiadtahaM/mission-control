import { AppLayout } from "@/components/layout/AppLayout";
import {
  useGetSubscription, getGetSubscriptionQueryKey,
  useGetInvoices, getGetInvoicesQueryKey,
  useCreateCheckoutSession,
  useGetPortalUrl, getGetPortalUrlQueryKey,
} from "@workspace/api-client-react";
import { useAuth } from "@/contexts/auth";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Check, ExternalLink, FileText } from "lucide-react";
import { format } from "date-fns";

const PLANS = [
  {
    key: "FREE",
    name: "Free",
    price: 0,
    features: ["5,000 API calls/mo", "1 project", "Community support", "Basic analytics"],
  },
  {
    key: "PRO",
    name: "Pro",
    price: 29,
    popular: true,
    features: ["100,000 API calls/mo", "10 projects", "Priority support", "Advanced analytics", "2FA & audit logs"],
  },
  {
    key: "ENTERPRISE",
    name: "Enterprise",
    price: 99,
    features: ["Unlimited API calls", "Unlimited projects", "Dedicated support", "Custom SLAs", "SSO & SCIM"],
  },
];

export default function BillingPage() {
  const { user } = useAuth();
  const { data: sub } = useGetSubscription({ query: { queryKey: getGetSubscriptionQueryKey() } });
  const { data: invoices } = useGetInvoices({}, { query: { queryKey: getGetInvoicesQueryKey() } });
  const checkout = useCreateCheckoutSession();
  const { data: portal } = useGetPortalUrl({ query: { queryKey: getGetPortalUrlQueryKey() } });

  const handleUpgrade = (plan: string) => {
    if (plan === "FREE") return;
    checkout.mutate({ data: { plan: plan as "PRO" | "ENTERPRISE" } }, {
      onSuccess: (data) => { window.location.href = data.url; },
    });
  };

  return (
    <AppLayout>
      <div className="p-6 space-y-5 max-w-4xl mx-auto">
        <div>
          <h1 className="text-lg font-semibold text-foreground">Billing</h1>
          <p className="text-sm text-muted-foreground">Subscription and invoices</p>
        </div>

        {/* Current plan bar */}
        {sub ? (
          <div className="bg-card border border-border rounded-lg px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-foreground">Current plan: {sub.plan}</span>
              <span className={`text-xs font-medium ${sub.status === "active" ? "text-emerald-400" : "text-destructive"}`}>
                {sub.status}
              </span>
              {sub.currentPeriodEnd && (
                <span className="text-xs text-muted-foreground">
                  Renews {format(new Date(sub.currentPeriodEnd), "MMM d, yyyy")}
                </span>
              )}
            </div>
            {portal?.url && (
              <Button variant="outline" size="sm" className="h-7 text-xs" onClick={() => window.open(portal.url, "_blank")} data-testid="button-portal">
                <ExternalLink className="w-3.5 h-3.5 mr-1.5" />
                Manage billing
              </Button>
            )}
          </div>
        ) : <Skeleton className="h-14 w-full rounded-lg" />}

        {/* Plan cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {PLANS.map((plan) => {
            const isCurrent = user?.plan === plan.key;
            return (
              <div
                key={plan.key}
                className={`bg-card border rounded-lg p-5 relative ${isCurrent ? "border-primary" : "border-border"}`}
                data-testid={`card-plan-${plan.key.toLowerCase()}`}
              >
                {plan.popular && (
                  <span className="absolute top-3 right-3 text-xs font-medium text-primary">Popular</span>
                )}
                <div className="mb-1">
                  <span className="text-sm font-semibold text-foreground">{plan.name}</span>
                </div>
                <div className="mb-4">
                  <span className="text-3xl font-semibold text-foreground">${plan.price}</span>
                  <span className="text-sm text-muted-foreground">/mo</span>
                </div>
                <ul className="space-y-2 mb-5">
                  {plan.features.map(f => (
                    <li key={f} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <Check className="w-3.5 h-3.5 text-primary flex-shrink-0 mt-0.5" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Button
                  className="w-full h-8 text-sm"
                  variant={isCurrent ? "secondary" : plan.popular ? "default" : "outline"}
                  disabled={isCurrent || checkout.isPending}
                  onClick={() => handleUpgrade(plan.key)}
                  data-testid={`button-plan-${plan.key.toLowerCase()}`}
                >
                  {isCurrent ? "Current plan" : plan.price === 0 ? "Downgrade" : "Upgrade"}
                </Button>
              </div>
            );
          })}
        </div>

        {/* Invoice history */}
        <div className="bg-card border border-border rounded-lg overflow-hidden">
          <div className="px-4 py-3 border-b border-border">
            <h3 className="text-sm font-medium text-foreground">Invoice History</h3>
          </div>
          {invoices ? (
            invoices.data.length === 0 ? (
              <p className="px-4 py-8 text-sm text-muted-foreground text-center">No invoices yet</p>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/20">
                    <th className="text-left px-4 py-2.5 text-xs font-medium text-muted-foreground">Invoice</th>
                    <th className="text-left px-4 py-2.5 text-xs font-medium text-muted-foreground">Amount</th>
                    <th className="text-left px-4 py-2.5 text-xs font-medium text-muted-foreground">Status</th>
                    <th className="text-left px-4 py-2.5 text-xs font-medium text-muted-foreground">Date</th>
                    <th className="text-right px-4 py-2.5 text-xs font-medium text-muted-foreground">PDF</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {invoices.data.map(inv => (
                    <tr key={inv.id} className="hover:bg-muted/20" data-testid={`row-invoice-${inv.id}`}>
                      <td className="px-4 py-3 text-xs font-mono text-muted-foreground">{inv.id.slice(0, 8)}</td>
                      <td className="px-4 py-3 font-medium text-foreground">${inv.amount.toFixed(2)}</td>
                      <td className="px-4 py-3 text-xs text-emerald-400 font-medium">{inv.status}</td>
                      <td className="px-4 py-3 text-xs text-muted-foreground">{format(new Date(inv.createdAt), "MMM d, yyyy")}</td>
                      <td className="px-4 py-3 text-right">
                        {inv.pdfUrl ? (
                          <a href={inv.pdfUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center w-7 h-7 hover:bg-muted rounded">
                            <FileText className="w-3.5 h-3.5 text-muted-foreground" />
                          </a>
                        ) : <span className="text-xs text-muted-foreground">—</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )
          ) : <Skeleton className="h-24 w-full" />}
        </div>
      </div>
    </AppLayout>
  );
}
