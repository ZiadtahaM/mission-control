import { AppLayout } from "@/components/layout/AppLayout";
import {
  useGetMe, getGetMeQueryKey, useUpdateMe, useChangePassword,
  useGetSessions, getGetSessionsQueryKey,
  useSetup2fa, useVerify2fa, useDisable2fa,
} from "@workspace/api-client-react";
import { useAuth } from "@/contexts/auth";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader2 } from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";

const profileSchema = z.object({ name: z.string().min(2, "At least 2 characters") });
const passwordSchema = z.object({
  oldPassword: z.string().min(1, "Required"),
  newPassword: z.string().min(8, "At least 8 characters"),
});
const totpSchema = z.object({ totpCode: z.string().length(6, "Must be 6 digits") });

type ProfileFields = z.infer<typeof profileSchema>;
type PasswordFields = z.infer<typeof passwordSchema>;
type TotpFields = z.infer<typeof totpSchema>;

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-card border border-border rounded-lg">
      <div className="px-4 py-3 border-b border-border">
        <h2 className="text-sm font-medium text-foreground">{title}</h2>
      </div>
      <div className="p-4">{children}</div>
    </div>
  );
}

export default function ProfilePage() {
  const { user, updateUser } = useAuth();
  const qc = useQueryClient();
  const { toast } = useToast();
  const [show2faSetup, setShow2faSetup] = useState(false);
  const [qrData, setQrData] = useState<{ secret: string; qrCodeUrl: string } | null>(null);

  const { data: me } = useGetMe({ query: { queryKey: getGetMeQueryKey() } });
  const { data: sessions } = useGetSessions({ query: { queryKey: getGetSessionsQueryKey() } });
  const updateMe = useUpdateMe();
  const changePassword = useChangePassword();
  const setup2fa = useSetup2fa();
  const verify2fa = useVerify2fa();
  const disable2fa = useDisable2fa();

  const profileForm = useForm<ProfileFields>({
    resolver: zodResolver(profileSchema),
    defaultValues: { name: user?.name || "" },
  });
  const passwordForm = useForm<PasswordFields>({ resolver: zodResolver(passwordSchema) });
  const totpForm = useForm<TotpFields>({ resolver: zodResolver(totpSchema), defaultValues: { totpCode: "" } });

  const onProfileSave = (v: ProfileFields) => {
    updateMe.mutate({ data: v }, {
      onSuccess: (data) => {
        updateUser(data as Parameters<typeof updateUser>[0]);
        qc.invalidateQueries({ queryKey: getGetMeQueryKey() });
        toast({ title: "Profile updated" });
      },
    });
  };

  const onPasswordChange = (v: PasswordFields) => {
    changePassword.mutate({ data: v }, {
      onSuccess: () => { toast({ title: "Password changed" }); passwordForm.reset(); },
      onError: () => toast({ title: "Current password incorrect", variant: "destructive" }),
    });
  };

  const onSetup2fa = () => {
    setup2fa.mutate(undefined, {
      onSuccess: (data) => { setQrData({ secret: data.secret, qrCodeUrl: data.qrCodeUrl }); setShow2faSetup(true); },
    });
  };

  const onVerify2fa = (v: TotpFields) => {
    verify2fa.mutate({ data: v }, {
      onSuccess: () => { toast({ title: "2FA enabled" }); setShow2faSetup(false); qc.invalidateQueries({ queryKey: getGetMeQueryKey() }); },
      onError: () => toast({ title: "Invalid code", variant: "destructive" }),
    });
  };

  const onDisable2fa = (v: TotpFields) => {
    disable2fa.mutate({ data: v }, {
      onSuccess: () => { toast({ title: "2FA disabled" }); qc.invalidateQueries({ queryKey: getGetMeQueryKey() }); },
      onError: () => toast({ title: "Invalid code", variant: "destructive" }),
    });
  };

  return (
    <AppLayout>
      <div className="p-6 space-y-4 max-w-2xl mx-auto">
        <div>
          <h1 className="text-lg font-semibold text-foreground">Profile</h1>
          <p className="text-sm text-muted-foreground">Account settings</p>
        </div>

        {/* Account info */}
        <Section title="Account">
          {me ? (
            <div className="mb-4 pb-4 border-b border-border">
              <div className="font-medium text-foreground">{me.name}</div>
              <div className="text-sm text-muted-foreground">{me.email}</div>
              <div className="flex gap-2 mt-1.5 text-xs text-muted-foreground">
                <span>{me.plan}</span>
                <span>·</span>
                <span>{me.role}</span>
                {me.emailVerified && <><span>·</span><span className="text-emerald-400">Verified</span></>}
              </div>
            </div>
          ) : <Skeleton className="h-12 w-full mb-4" />}

          <form onSubmit={profileForm.handleSubmit(onProfileSave)} className="space-y-3">
            <div className="space-y-1.5">
              <Label className="text-sm">Display name</Label>
              <Input {...profileForm.register("name")} data-testid="input-name" />
              {profileForm.formState.errors.name && (
                <p className="text-xs text-destructive">{profileForm.formState.errors.name.message}</p>
              )}
            </div>
            <Button type="submit" size="sm" disabled={updateMe.isPending} data-testid="button-save-profile">
              {updateMe.isPending && <Loader2 className="w-3.5 h-3.5 animate-spin mr-2" />}
              Save
            </Button>
          </form>
        </Section>

        {/* Change password */}
        <Section title="Change password">
          <form onSubmit={passwordForm.handleSubmit(onPasswordChange)} className="space-y-3">
            <div className="space-y-1.5">
              <Label className="text-sm">Current password</Label>
              <Input type="password" {...passwordForm.register("oldPassword")} data-testid="input-old-password" />
              {passwordForm.formState.errors.oldPassword && (
                <p className="text-xs text-destructive">{passwordForm.formState.errors.oldPassword.message}</p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label className="text-sm">New password</Label>
              <Input type="password" {...passwordForm.register("newPassword")} data-testid="input-new-password" />
              {passwordForm.formState.errors.newPassword && (
                <p className="text-xs text-destructive">{passwordForm.formState.errors.newPassword.message}</p>
              )}
            </div>
            <Button type="submit" size="sm" disabled={changePassword.isPending} data-testid="button-change-password">
              {changePassword.isPending && <Loader2 className="w-3.5 h-3.5 animate-spin mr-2" />}
              Update password
            </Button>
          </form>
        </Section>

        {/* 2FA */}
        <Section title="Two-factor authentication">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm text-muted-foreground">
              {me?.twoFactorEnabled ? "2FA is enabled on your account." : "Add an extra layer of security."}
            </p>
            {me?.twoFactorEnabled && (
              <span className="text-xs font-medium text-emerald-400">Enabled</span>
            )}
          </div>

          {!show2faSetup && !me?.twoFactorEnabled && (
            <Button onClick={onSetup2fa} disabled={setup2fa.isPending} size="sm" variant="outline" data-testid="button-setup-2fa">
              {setup2fa.isPending && <Loader2 className="w-3.5 h-3.5 animate-spin mr-2" />}
              Enable 2FA
            </Button>
          )}

          {show2faSetup && qrData && (
            <div className="space-y-3">
              <div className="p-3 rounded-lg border border-border bg-muted/20">
                <p className="text-xs text-muted-foreground mb-3">Scan with your authenticator app, then enter the 6-digit code.</p>
                <img src={qrData.qrCodeUrl} alt="2FA QR Code" className="w-40 h-40 rounded mx-auto" />
                <p className="text-xs font-mono text-center text-muted-foreground mt-2 break-all">{qrData.secret}</p>
              </div>
              <form onSubmit={totpForm.handleSubmit(onVerify2fa)} className="flex gap-2">
                <Input {...totpForm.register("totpCode")} placeholder="000000" maxLength={6} className="font-mono w-32" data-testid="input-totp" />
                <Button type="submit" size="sm" disabled={verify2fa.isPending} data-testid="button-verify-2fa">Verify</Button>
                <Button type="button" variant="ghost" size="sm" onClick={() => setShow2faSetup(false)}>Cancel</Button>
              </form>
              {totpForm.formState.errors.totpCode && (
                <p className="text-xs text-destructive">{totpForm.formState.errors.totpCode.message}</p>
              )}
            </div>
          )}

          {me?.twoFactorEnabled && !show2faSetup && (
            <form onSubmit={totpForm.handleSubmit(onDisable2fa)} className="flex gap-2">
              <Input {...totpForm.register("totpCode")} placeholder="Enter code to disable" maxLength={6} className="font-mono w-48" data-testid="input-totp-disable" />
              <Button type="submit" variant="destructive" size="sm" disabled={disable2fa.isPending} data-testid="button-disable-2fa">
                Disable 2FA
              </Button>
            </form>
          )}
        </Section>

        {/* Sessions */}
        <div className="bg-card border border-border rounded-lg overflow-hidden">
          <div className="px-4 py-3 border-b border-border">
            <h2 className="text-sm font-medium text-foreground">Active sessions</h2>
          </div>
          {sessions ? (
            <div className="divide-y divide-border/50">
              {sessions.map(s => (
                <div key={s.id} className="flex items-center gap-3 px-4 py-3" data-testid={`row-session-${s.id}`}>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm text-foreground truncate">{s.userAgent?.slice(0, 60) || "Unknown device"}</div>
                    <div className="text-xs text-muted-foreground">{s.ipAddress || "Unknown IP"}</div>
                  </div>
                  <div className="text-xs text-muted-foreground flex-shrink-0">
                    {format(new Date(s.createdAt), "MMM d")}
                  </div>
                </div>
              ))}
              {sessions.length === 0 && (
                <p className="px-4 py-4 text-sm text-muted-foreground">No active sessions</p>
              )}
            </div>
          ) : <Skeleton className="h-16 w-full" />}
        </div>
      </div>
    </AppLayout>
  );
}
