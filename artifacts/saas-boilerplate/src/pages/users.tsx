import { AppLayout } from "@/components/layout/AppLayout";
import { useState } from "react";
import {
  useGetAdminUsers, getGetAdminUsersQueryKey,
  useBanUser, useUnbanUser, useChangeUserRole,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { useDebounce } from "@/hooks/use-debounce";

const PLAN_BADGE: Record<string, string> = {
  FREE: "text-muted-foreground",
  PRO: "text-primary",
  ENTERPRISE: "text-amber-400",
};
const ROLE_BADGE: Record<string, string> = {
  USER: "text-muted-foreground",
  ADMIN: "text-blue-400",
  SUPER_ADMIN: "text-violet-400",
};

export default function UsersPage() {
  const [search, setSearch] = useState("");
  const [plan, setPlan] = useState("");
  const [role, setRole] = useState("");
  const [page, setPage] = useState(1);
  const limit = 15;
  const qc = useQueryClient();

  const debouncedSearch = useDebounce(search, 350);

  const params = {
    page,
    limit,
    ...(debouncedSearch ? { search: debouncedSearch } : {}),
    ...(plan ? { plan } : {}),
    ...(role ? { role } : {}),
  };
  const { data, isLoading } = useGetAdminUsers(params, {
    query: { queryKey: getGetAdminUsersQueryKey(params) },
  });

  const banUser = useBanUser();
  const unbanUser = useUnbanUser();
  const changeRole = useChangeUserRole();

  const invalidate = () => qc.invalidateQueries({ queryKey: getGetAdminUsersQueryKey(params) });

  const handleBan = (userId: string, banned: boolean) => {
    if (banned) unbanUser.mutate({ userId }, { onSuccess: invalidate });
    else banUser.mutate({ userId }, { onSuccess: invalidate });
  };

  const handleSearch = (v: string) => {
    setSearch(v);
    setPage(1);
  };

  const total = data?.total ?? 0;
  const totalPages = Math.ceil(total / limit);

  return (
    <AppLayout>
      <div className="p-6 space-y-4 max-w-7xl mx-auto">
        <div>
          <h1 className="text-lg font-semibold text-foreground">Users</h1>
          <p className="text-sm text-muted-foreground">{total.toLocaleString()} total</p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative flex-1 min-w-56">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
            <Input
              value={search}
              onChange={e => handleSearch(e.target.value)}
              placeholder="Search name or email..."
              className="pl-9 h-8 text-sm"
              data-testid="input-search"
            />
          </div>
          <Select value={plan || "all"} onValueChange={v => { setPlan(v === "all" ? "" : v); setPage(1); }}>
            <SelectTrigger className="w-32 h-8 text-sm" data-testid="select-plan">
              <SelectValue placeholder="Plan" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All plans</SelectItem>
              <SelectItem value="FREE">Free</SelectItem>
              <SelectItem value="PRO">Pro</SelectItem>
              <SelectItem value="ENTERPRISE">Enterprise</SelectItem>
            </SelectContent>
          </Select>
          <Select value={role || "all"} onValueChange={v => { setRole(v === "all" ? "" : v); setPage(1); }}>
            <SelectTrigger className="w-36 h-8 text-sm" data-testid="select-role">
              <SelectValue placeholder="Role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All roles</SelectItem>
              <SelectItem value="USER">User</SelectItem>
              <SelectItem value="ADMIN">Admin</SelectItem>
              <SelectItem value="SUPER_ADMIN">Super Admin</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Table */}
        <div className="bg-card border border-border rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="text-left px-4 py-2.5 text-xs font-medium text-muted-foreground">User</th>
                <th className="text-left px-4 py-2.5 text-xs font-medium text-muted-foreground">Plan</th>
                <th className="text-left px-4 py-2.5 text-xs font-medium text-muted-foreground">Role</th>
                <th className="text-left px-4 py-2.5 text-xs font-medium text-muted-foreground">Joined</th>
                <th className="text-left px-4 py-2.5 text-xs font-medium text-muted-foreground">Status</th>
                <th className="text-right px-4 py-2.5 text-xs font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {isLoading
                ? Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    <td className="px-4 py-3"><Skeleton className="h-8 w-48" /></td>
                    <td className="px-4 py-3"><Skeleton className="h-4 w-12" /></td>
                    <td className="px-4 py-3"><Skeleton className="h-4 w-16" /></td>
                    <td className="px-4 py-3"><Skeleton className="h-4 w-20" /></td>
                    <td className="px-4 py-3"><Skeleton className="h-4 w-14" /></td>
                    <td className="px-4 py-3"><Skeleton className="h-6 w-12 ml-auto" /></td>
                  </tr>
                ))
                : data?.data.map((user) => (
                  <tr key={user.id} className="hover:bg-muted/20 transition-colors" data-testid={`row-user-${user.id}`}>
                    <td className="px-4 py-3">
                      <div className="font-medium text-foreground">{user.name}</div>
                      <div className="text-xs text-muted-foreground">{user.email}</div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-medium ${PLAN_BADGE[user.plan]}`}>{user.plan}</span>
                    </td>
                    <td className="px-4 py-3">
                      <Select value={user.role} onValueChange={v => changeRole.mutate({ userId: user.id, data: { role: v as "SUPER_ADMIN" | "ADMIN" | "USER" } }, { onSuccess: invalidate })}>
                        <SelectTrigger className={`h-7 w-32 text-xs border-0 px-2 bg-transparent ${ROLE_BADGE[user.role]}`} data-testid={`select-role-${user.id}`}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="USER">User</SelectItem>
                          <SelectItem value="ADMIN">Admin</SelectItem>
                          <SelectItem value="SUPER_ADMIN">Super Admin</SelectItem>
                        </SelectContent>
                      </Select>
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">
                      {format(new Date(user.createdAt), "MMM d, yyyy")}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-medium ${user.banned ? "text-destructive" : user.emailVerified ? "text-emerald-400" : "text-muted-foreground"}`}>
                        {user.banned ? "Banned" : user.emailVerified ? "Active" : "Unverified"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleBan(user.id, user.banned)}
                        className={`h-7 px-2 text-xs ${user.banned ? "text-emerald-400 hover:text-emerald-300" : "text-destructive hover:text-destructive/80"}`}
                        data-testid={`button-ban-${user.id}`}
                      >
                        {user.banned ? "Unban" : "Ban"}
                      </Button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>

          <div className="flex items-center justify-between px-4 py-2.5 border-t border-border bg-muted/10">
            <span className="text-xs text-muted-foreground">
              {total > 0 ? `${((page - 1) * limit) + 1}–${Math.min(page * limit, total)} of ${total}` : "No results"}
            </span>
            <div className="flex items-center gap-1.5">
              <Button variant="ghost" size="sm" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="h-7 w-7 p-0">
                <ChevronLeft className="w-3.5 h-3.5" />
              </Button>
              <span className="text-xs text-muted-foreground tabular-nums">{page} / {Math.max(1, totalPages)}</span>
              <Button variant="ghost" size="sm" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page >= totalPages} className="h-7 w-7 p-0">
                <ChevronRight className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
