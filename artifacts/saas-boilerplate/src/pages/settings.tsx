import { AppLayout } from "@/components/layout/AppLayout";
import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Copy, Check, Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/contexts/auth";

const NOTIF_OPTIONS = [
  { key: "email" as const, label: "Email notifications", desc: "Account updates via email" },
  { key: "security" as const, label: "Security alerts", desc: "Login attempts and account changes" },
  { key: "billing" as const, label: "Billing notifications", desc: "Invoice and payment updates" },
  { key: "marketing" as const, label: "Product updates", desc: "New features and announcements" },
] as const;

function Section({ title, description, children }: { title: string; description?: string; children: React.ReactNode }) {
  return (
    <div className="bg-card border border-border rounded-lg">
      <div className="px-4 py-3 border-b border-border">
        <h2 className="text-sm font-medium text-foreground">{title}</h2>
        {description && <p className="text-xs text-muted-foreground mt-0.5">{description}</p>}
      </div>
      <div className="p-4">{children}</div>
    </div>
  );
}

export default function SettingsPage() {
  const { user } = useAuth();
  const [copied, setCopied] = useState(false);
  const [showKey, setShowKey] = useState(false);
  const [notifs, setNotifs] = useState({ email: true, security: true, billing: true, marketing: false });

  const apiKey = `lk_${user?.id?.replace(/-/g, "").slice(0, 32) ?? "demo"}`;
  const maskedKey = showKey ? apiKey : apiKey.slice(0, 8) + "•".repeat(28);

  const copyKey = () => {
    navigator.clipboard.writeText(apiKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <AppLayout>
      <div className="p-6 space-y-4 max-w-2xl mx-auto">
        <div>
          <h1 className="text-lg font-semibold text-foreground">Settings</h1>
          <p className="text-sm text-muted-foreground">Workspace preferences</p>
        </div>

        <Section title="API Key" description="Use this key to authenticate API requests. Keep it secret.">
          <div className="flex gap-2">
            <Input value={maskedKey} readOnly className="font-mono text-sm flex-1" data-testid="input-api-key" />
            <Button variant="ghost" size="icon" className="h-9 w-9" onClick={() => setShowKey(!showKey)} data-testid="button-toggle-key">
              {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </Button>
            <Button variant="ghost" size="icon" className="h-9 w-9" onClick={copyKey} data-testid="button-copy-key">
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </Button>
          </div>
        </Section>

        <Section title="Notifications">
          <div className="space-y-4">
            {NOTIF_OPTIONS.map(({ key, label, desc }) => (
              <div key={key} className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium text-foreground cursor-pointer" htmlFor={`switch-${key}`}>{label}</Label>
                  <p className="text-xs text-muted-foreground">{desc}</p>
                </div>
                <Switch
                  id={`switch-${key}`}
                  checked={notifs[key]}
                  onCheckedChange={v => setNotifs(n => ({ ...n, [key]: v }))}
                  data-testid={`switch-${key}`}
                />
              </div>
            ))}
          </div>
        </Section>

        <div className="bg-card border border-destructive/20 rounded-lg">
          <div className="px-4 py-3 border-b border-destructive/20">
            <h2 className="text-sm font-medium text-destructive">Danger Zone</h2>
          </div>
          <div className="p-4 flex items-center justify-between">
            <div>
              <div className="text-sm font-medium text-foreground">Delete account</div>
              <div className="text-xs text-muted-foreground">Account will be scheduled for deletion in 30 days.</div>
            </div>
            <Button variant="destructive" size="sm" data-testid="button-delete-account">Delete account</Button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
