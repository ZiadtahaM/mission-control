import { Router } from "express";
import { db } from "@workspace/db";
import { usersTable, auditLogsTable } from "@workspace/db";
import { eq, sql, ilike, or, and, isNull, desc } from "drizzle-orm";
import { authenticate, requireRole, AuthRequest } from "../middlewares/authenticate.js";

const router = Router();

router.use(authenticate);
router.use(requireRole("SUPER_ADMIN", "ADMIN"));

function safeUser(user: {
  id: string;
  email: string;
  name: string;
  role: string;
  plan: string;
  emailVerified: boolean;
  twoFactorEnabled: boolean;
  avatarUrl: string | null;
  createdAt: Date;
  banned: boolean;
}) {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    plan: user.plan,
    emailVerified: user.emailVerified,
    twoFactorEnabled: user.twoFactorEnabled,
    avatarUrl: user.avatarUrl,
    createdAt: user.createdAt,
    banned: user.banned,
  };
}

// GET /api/admin/users
router.get("/users", async (req, res) => {
  const page = parseInt(String(req.query["page"] || "1"));
  const limit = parseInt(String(req.query["limit"] || "20"));
  const search = req.query["search"] as string | undefined;
  const plan = req.query["plan"] as string | undefined;
  const role = req.query["role"] as string | undefined;

  const conditions = [isNull(usersTable.deletedAt)];

  if (search) {
    conditions.push(
      or(
        ilike(usersTable.email, `%${search}%`),
        ilike(usersTable.name, `%${search}%`),
      )!,
    );
  }

  if (plan && ["FREE", "PRO", "ENTERPRISE"].includes(plan)) {
    conditions.push(eq(usersTable.plan, plan as "FREE" | "PRO" | "ENTERPRISE"));
  }

  if (role && ["SUPER_ADMIN", "ADMIN", "USER"].includes(role)) {
    conditions.push(
      eq(usersTable.role, role as "SUPER_ADMIN" | "ADMIN" | "USER"),
    );
  }

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

  const [countResult] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(usersTable)
    .where(whereClause);

  const users = await db
    .select({
      id: usersTable.id,
      email: usersTable.email,
      name: usersTable.name,
      role: usersTable.role,
      plan: usersTable.plan,
      emailVerified: usersTable.emailVerified,
      twoFactorEnabled: usersTable.twoFactorEnabled,
      avatarUrl: usersTable.avatarUrl,
      createdAt: usersTable.createdAt,
      banned: usersTable.banned,
    })
    .from(usersTable)
    .where(whereClause)
    .orderBy(usersTable.createdAt)
    .limit(limit)
    .offset((page - 1) * limit);

  res.json({
    data: users.map(safeUser),
    total: countResult.count,
    page,
    limit,
  });
});

// POST /api/admin/users/:userId/ban
router.post("/users/:userId/ban", async (req: AuthRequest, res) => {
  const { userId } = req.params;

  await db
    .update(usersTable)
    .set({ banned: true, updatedAt: new Date() })
    .where(eq(usersTable.id, userId!));

  await db.insert(auditLogsTable).values({
    userId: req.userId!,
    action: "admin.ban_user",
    resourceType: "user",
    resourceId: userId,
    ipAddress: req.ip,
  });

  res.json({ message: "User banned" });
});

// POST /api/admin/users/:userId/unban
router.post("/users/:userId/unban", async (req: AuthRequest, res) => {
  const { userId } = req.params;

  await db
    .update(usersTable)
    .set({ banned: false, updatedAt: new Date() })
    .where(eq(usersTable.id, userId!));

  await db.insert(auditLogsTable).values({
    userId: req.userId!,
    action: "admin.unban_user",
    resourceType: "user",
    resourceId: userId,
    ipAddress: req.ip,
  });

  res.json({ message: "User unbanned" });
});

// PATCH /api/admin/users/:userId/role
router.patch("/users/:userId/role", async (req: AuthRequest, res) => {
  const { userId } = req.params;
  const { role } = req.body as { role?: string };

  if (!role || !["SUPER_ADMIN", "ADMIN", "USER"].includes(role)) {
    res.status(400).json({ message: "Invalid role" });
    return;
  }

  await db
    .update(usersTable)
    .set({
      role: role as "SUPER_ADMIN" | "ADMIN" | "USER",
      updatedAt: new Date(),
    })
    .where(eq(usersTable.id, userId!));

  await db.insert(auditLogsTable).values({
    userId: req.userId!,
    action: "admin.change_role",
    resourceType: "user",
    resourceId: userId,
    ipAddress: req.ip,
    payload: { role },
  });

  res.json({ message: "Role updated" });
});

// GET /api/admin/audit-logs
router.get("/audit-logs", async (req, res) => {
  const page = parseInt(String(req.query["page"] || "1"));
  const limit = Math.min(parseInt(String(req.query["limit"] || "50")), 200);
  const action = req.query["action"] as string | undefined;
  const userId = req.query["userId"] as string | undefined;
  const fromDate = req.query["from"] as string | undefined;
  const toDate = req.query["to"] as string | undefined;

  const conditions = [];
  if (action) conditions.push(eq(auditLogsTable.action, action));
  if (userId) conditions.push(eq(auditLogsTable.userId!, userId));
  if (fromDate) {
    const from = new Date(fromDate);
    if (!isNaN(from.getTime())) {
      conditions.push(
        sql`${auditLogsTable.createdAt} >= ${from.toISOString()}`,
      );
    }
  }
  if (toDate) {
    const to = new Date(toDate);
    if (!isNaN(to.getTime())) {
      conditions.push(sql`${auditLogsTable.createdAt} <= ${to.toISOString()}`);
    }
  }

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

  const [countResult] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(auditLogsTable)
    .where(whereClause);

  const logs = await db
    .select()
    .from(auditLogsTable)
    .where(whereClause)
    .orderBy(desc(auditLogsTable.createdAt))
    .limit(limit)
    .offset((page - 1) * limit);

  res.json({
    data: logs,
    total: countResult?.count ?? 0,
    page,
    limit,
  });
});

export default router;
