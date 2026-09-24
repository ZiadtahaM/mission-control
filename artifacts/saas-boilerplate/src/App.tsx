import { Switch, Route, Router as WouterRouter, Redirect } from "wouter";
import { QueryClient, QueryClientProvider, QueryCache, MutationCache } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster, toast } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/contexts/auth";
import { setTokenGetter } from "@/lib/api";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import NotFound from "@/pages/not-found";
import LoginPage from "@/pages/login";
import RegisterPage from "@/pages/register";
import ForgotPasswordPage from "@/pages/forgot-password";
import DashboardPage from "@/pages/dashboard";
import UsersPage from "@/pages/users";
import BillingPage from "@/pages/billing";
import ProfilePage from "@/pages/profile";
import SettingsPage from "@/pages/settings";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";

function getErrorMessage(err: unknown): string {
  if (err && typeof err === "object" && "message" in err) {
    return String((err as { message: unknown }).message);
  }
  return "An unexpected error occurred";
}

const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (err, query) => {
      if (query.state.data !== undefined) {
        toast.error("Failed to refresh data", {
          description: getErrorMessage(err),
          duration: 4000,
        });
      }
    },
  }),
  mutationCache: new MutationCache({
    onError: (err) => {
      toast.error("Action failed", {
        description: getErrorMessage(err),
        duration: 4000,
      });
    },
  }),
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 30_000,
    },
  },
});

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }
  if (!isAuthenticated) return <Redirect to="/login" />;
  return <>{children}</>;
}

function AdminRoute({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated, isLoading } = useAuth();
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }
  if (!isAuthenticated) return <Redirect to="/login" />;
  if (user?.role !== "SUPER_ADMIN" && user?.role !== "ADMIN") return <Redirect to="/dashboard" />;
  return <>{children}</>;
}

function TokenSync() {
  const { accessToken } = useAuth();
  useEffect(() => {
    setTokenGetter(() => accessToken);
  }, [accessToken]);
  return null;
}

function Router() {
  return (
    <>
      <TokenSync />
      <Switch>
        <Route path="/login" component={LoginPage} />
        <Route path="/register" component={RegisterPage} />
        <Route path="/forgot-password" component={ForgotPasswordPage} />

        <Route path="/">
          {() => <Redirect to="/dashboard" />}
        </Route>

        <Route path="/dashboard">
          {() => <PrivateRoute><DashboardPage /></PrivateRoute>}
        </Route>
        <Route path="/users">
          {() => <AdminRoute><UsersPage /></AdminRoute>}
        </Route>
        <Route path="/billing">
          {() => <PrivateRoute><BillingPage /></PrivateRoute>}
        </Route>
        <Route path="/profile">
          {() => <PrivateRoute><ProfilePage /></PrivateRoute>}
        </Route>
        <Route path="/settings">
          {() => <PrivateRoute><SettingsPage /></PrivateRoute>}
        </Route>

        <Route component={NotFound} />
      </Switch>
    </>
  );
}

function App() {
  return (
    <ErrorBoundary name="root">
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <TooltipProvider>
            <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
              <Router />
            </WouterRouter>
            <Toaster />
            <SonnerToaster
              position="bottom-right"
              offset="2rem"
              toastOptions={{
                style: {
                  background: "hsl(222,40%,10%)",
                  border: "1px solid hsl(222,30%,16%)",
                  color: "hsl(213,31%,91%)",
                },
              }}
            />
          </TooltipProvider>
        </AuthProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
