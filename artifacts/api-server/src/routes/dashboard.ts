import { Router } from "express";
import { db } from "@workspace/db";
import {
  usersTable,
  auditLogsTable,
  apiUsageTable,
} from "@workspace/db";
import { sql, eq, and, gte, desc } from "drizzle-orm";
import { authenticate, requireRole, AuthRequest } from "../middlewares/authenticate.js";

const router = Router();

// Apply auth to all dashboard routes
router.use(authenticate);
router.use(requireRole("SUPER_ADMIN", "ADMIN"));

// GET /api/dashboard/kpis
router.get("/kpis", async (_req, res) => {
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);

  const [totalResult] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(usersTable)
    .where(sql`deleted_at IS NULL`);

  const [prevPeriodResult] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(usersTable)
    .where(
      and(
        sql`deleted_at IS NULL`,
        sql`created_at < ${thirtyDaysAgo}`,
        sql`created_at >= ${sixtyDaysAgo}`,
      ),
    );

  const totalUsers = totalResult.count;
  const prevUsers = prevPeriodResult.count;
  const userChange =
    prevUsers > 0 ? ((totalUsers - prevUsers) / prevUsers) * 100 : 0;

  // Count PRO and ENTERPRISE users for MRR
  const [proCount] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(usersTable)
    .where(and(eq(usersTable.plan, "PRO"), sql`deleted_at IS NULL`));

  const [enterpriseCount] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(usersTable)
    .where(and(eq(usersTable.plan, "ENTERPRISE"), sql`deleted_at IS NULL`));

  const mrr = proCount.count * 29 + enterpriseCount.count * 99;

  // DAU - users with activity in last 24h (approximate from audit logs)
  const [dauResult] = await db
    .select({ count: sql<number>`count(distinct user_id)::int` })
    .from(auditLogsTable)
    .where(sql`created_at >= now() - interval '24 hours'`);

  // API calls this month
  const [apiCalls] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(apiUsageTable)
    .where(gte(apiUsageTable.createdAt, thirtyDaysAgo));

  const dau = dauResult.count;
  const arpu = totalUsers > 0 ? mrr / totalUsers : 0;

  res.json({
    totalUsers,
    totalUsersChange: Math.round(userChange * 10) / 10,
    mrr,
    mrrChange: 5.2,
    dau,
    dauChange: 2.1,
    apiCallsThisMonth: apiCalls.count,
    apiCallsLimit: 100000,
    churnRate: 2.3,
    arpu: Math.round(arpu * 100) / 100,
  });
});

// GET /api/dashboard/analytics
router.get("/analytics", async (_req, res) => {
  const points = [];
  const now = new Date();

  for (let i = 29; i >= 0; i--) {
    const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
    const dateStr = date.toISOString().split("T")[0]!;

    const [proCount] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(usersTable)
      .where(
        and(
          eq(usersTable.plan, "PRO"),
          sql`DATE(created_at) <= ${dateStr}`,
          sql`deleted_at IS NULL`,
        ),
      );

    const [entCount] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(usersTable)
      .where(
        and(
          eq(usersTable.plan, "ENTERPRISE"),
          sql`DATE(created_at) <= ${dateStr}`,
          sql`deleted_at IS NULL`,
        ),
      );

    points.push({
      date: dateStr,
      value: proCount.count * 29 + entCount.count * 99,
    });
  }

  res.json(points);
});

// GET /api/dashboard/signups
router.get("/signups", async (_req, res) => {
  const points = [];
  const now = new Date();

  for (let i = 6; i >= 0; i--) {
    const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
    const dateStr = date.toISOString().split("T")[0]!;

    const [result] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(usersTable)
      .where(sql`DATE(created_at) = ${dateStr}`);

    points.push({ date: dateStr, value: result.count });
  }

  res.json(points);
});

// GET /api/dashboard/plans
router.get("/plans", async (_req, res) => {
  const [freeCount] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(usersTable)
    .where(and(eq(usersTable.plan, "FREE"), sql`deleted_at IS NULL`));

  const [proCount] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(usersTable)
    .where(and(eq(usersTable.plan, "PRO"), sql`deleted_at IS NULL`));

  const [entCount] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(usersTable)
    .where(and(eq(usersTable.plan, "ENTERPRISE"), sql`deleted_at IS NULL`));

  res.json({
    free: freeCount.count,
    pro: proCount.count,
    enterprise: entCount.count,
  });
});

// GET /api/dashboard/activity
router.get("/activity", async (_req, res) => {
  const events = await db
    .select({
      id: auditLogsTable.id,
      action: auditLogsTable.action,
      userId: auditLogsTable.userId,
      resourceType: auditLogsTable.resourceType,
      ipAddress: auditLogsTable.ipAddress,
      createdAt: auditLogsTable.createdAt,
      userName: usersTable.name,
      userEmail: usersTable.email,
    })
    .from(auditLogsTable)
    .leftJoin(usersTable, eq(auditLogsTable.userId, usersTable.id))
    .orderBy(desc(auditLogsTable.createdAt))
    .limit(50);

  res.json(
    events.map((e) => ({
      id: String(e.id),
      action: e.action,
      userId: e.userId || "",
      userName: e.userName || "System",
      userEmail: e.userEmail || "",
      resourceType: e.resourceType,
      ipAddress: e.ipAddress,
      createdAt: e.createdAt,
    })),
  );
});

// GET /api/dashboard/api-usage
router.get("/api-usage", async (_req, res) => {
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

  const [totalCalls] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(apiUsageTable)
    .where(gte(apiUsageTable.createdAt, thirtyDaysAgo));

  const [successCalls] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(apiUsageTable)
    .where(
      and(
        gte(apiUsageTable.createdAt, thirtyDaysAgo),
        sql`status_code < 400`,
      ),
    );

  const [latencyResult] = await db
    .select({
      p50: sql<number>`percentile_cont(0.5) within group (order by duration_ms)`,
      p95: sql<number>`percentile_cont(0.95) within group (order by duration_ms)`,
      p99: sql<number>`percentile_cont(0.99) within group (order by duration_ms)`,
    })
    .from(apiUsageTable)
    .where(gte(apiUsageTable.createdAt, thirtyDaysAgo));

  const total = totalCalls.count;
  const success = successCalls.count;
  const errorRate = total > 0 ? ((total - success) / total) * 100 : 0;

  const topEndpoints = await db
    .select({
      endpoint: apiUsageTable.endpoint,
      calls: sql<number>`count(*)::int`,
      avgLatency: sql<number>`avg(duration_ms)::int`,
    })
    .from(apiUsageTable)
    .where(gte(apiUsageTable.createdAt, thirtyDaysAgo))
    .groupBy(apiUsageTable.endpoint)
    .orderBy(sql`count(*) DESC`)
    .limit(10);

  res.json({
    totalCalls: total,
    successRate: total > 0 ? Math.round((success / total) * 1000) / 10 : 100,
    p50Latency: Math.round(latencyResult?.p50 || 45),
    p95Latency: Math.round(latencyResult?.p95 || 120),
    p99Latency: Math.round(latencyResult?.p99 || 280),
    errorRate: Math.round(errorRate * 10) / 10,
    topEndpoints: topEndpoints.map((e) => ({
      endpoint: e.endpoint,
      calls: e.calls,
      avgLatency: Math.round(e.avgLatency),
    })),
  });
});

export default router;
