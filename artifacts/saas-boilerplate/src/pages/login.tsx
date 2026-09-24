import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, useLocation } from "wouter";
import { Loader2, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLogin } from "@workspace/api-client-react";
import { useAuth } from "@/contexts/auth";

const schema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(1, "Password required"),
});
type Fields = z.infer<typeof schema>;

export default function LoginPage() {
  const { login } = useAuth();
  const [, setLocation] = useLocation();
  const [error, setError] = useState("");
  const mut = useLogin();

  const { register, handleSubmit, formState: { errors } } = useForm<Fields>({
    resolver: zodResolver(schema),
  });

  const onSubmit = (values: Fields) => {
    setError("");
    mut.mutate({ data: values }, {
      onSuccess: (data) => {
        login(data.accessToken, data.refreshToken, data.user as Parameters<typeof login>[2]);
        setLocation("/dashboard");
      },
      onError: (err: unknown) => {
        setError((err as { message?: string })?.message || "Invalid credentials");
      },
    });
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-sm">

        <div className="mb-8 text-center">
          <div className="inline-flex items-center gap-2 mb-6">
            <div className="w-7 h-7 rounded-md bg-primary flex items-center justify-center">
              <Globe className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold text-foreground">Nexus</span>
            <span className="text-xs font-medium text-primary/70 bg-primary/10 px-1.5 py-0.5 rounded-sm">Control</span>
          </div>
          <h1 className="text-2xl font-semibold text-foreground">Sign in</h1>
          <p className="text-sm text-muted-foreground mt-1">Admin access to the Nexus platform</p>
        </div>

        <div className="bg-card border border-border rounded-lg p-6">
          {error && (
            <p className="text-sm text-destructive mb-4 p-2.5 bg-destructive/10 rounded-md">{error}</p>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-sm">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@nexus.app"
                autoComplete="email"
                {...register("email")}
                data-testid="input-email"
              />
              {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-sm">Password</Label>
                <Link href="/forgot-password" className="text-xs text-primary hover:underline">
                  Forgot password?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                autoComplete="current-password"
                {...register("password")}
                data-testid="input-password"
              />
              {errors.password && <p className="text-xs text-destructive">{errors.password.message}</p>}
            </div>

            <Button type="submit" className="w-full" disabled={mut.isPending} data-testid="button-submit">
              {mut.isPending && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
              Sign in
            </Button>
          </form>
        </div>

        <p className="text-center text-sm text-muted-foreground mt-4">
          No account?{" "}
          <Link href="/register" className="text-foreground hover:underline font-medium">Create one</Link>
        </p>

        <div className="mt-6 border border-border rounded-md p-3">
          <p className="text-xs text-muted-foreground mb-1 font-medium">Demo credentials</p>
          <p className="text-xs font-mono text-muted-foreground">admin@nexus.app / Admin1234!</p>
        </div>
      </div>
    </div>
  );
}
