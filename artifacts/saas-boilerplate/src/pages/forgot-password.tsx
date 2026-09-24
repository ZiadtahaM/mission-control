import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link } from "wouter";
import { Loader2, Globe, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForgotPassword } from "@workspace/api-client-react";
import { useState } from "react";

const schema = z.object({ email: z.string().email("Invalid email") });

export default function ForgotPasswordPage() {
  const [sent, setSent] = useState(false);
  const mutation = useForgotPassword();
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { email: "" },
  });

  const onSubmit = (values: z.infer<typeof schema>) => {
    mutation.mutate({ data: values }, { onSuccess: () => setSent(true) });
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="flex items-center gap-2.5 mb-8 justify-center">
          <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/30">
            <Globe className="w-5 h-5 text-white" />
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-xl font-bold text-foreground">Nexus</span>
            <span className="text-xs font-medium text-primary/70 bg-primary/10 px-1.5 py-0.5 rounded-sm">Control</span>
          </div>
        </div>
        <div className="bg-card border border-border rounded-xl p-6 shadow-lg">
          {sent ? (
            <div className="text-center py-4">
              <CheckCircle2 className="w-12 h-12 text-primary mx-auto mb-3" />
              <h2 className="text-lg font-semibold text-foreground mb-2">Check your email</h2>
              <p className="text-sm text-muted-foreground">If that email exists, we've sent a reset link.</p>
              <Link href="/login" className="mt-4 inline-block text-sm text-primary hover:underline">Back to sign in</Link>
            </div>
          ) : (
            <>
              <h1 className="text-xl font-semibold text-foreground mb-1">Reset password</h1>
              <p className="text-sm text-muted-foreground mb-6">Enter your email and we'll send a reset link.</p>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField control={form.control} name="email" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground/80 text-sm">Email</FormLabel>
                      <FormControl>
                        <Input {...field} type="email" placeholder="you@nexus.app" className="bg-input border-border" data-testid="input-email" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={mutation.isPending} data-testid="button-submit">
                    {mutation.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                    Send reset link
                  </Button>
                </form>
              </Form>
              <div className="mt-4 text-center">
                <Link href="/login" className="text-sm text-primary hover:underline">Back to sign in</Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
