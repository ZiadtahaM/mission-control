import { Router } from "express";
import { db } from "@workspace/db";
import { usersTable, sessionsTable, auditLogsTable } from "@workspace/db";
import { eq, isNull, and } from "drizzle-orm";
import { authenticate, AuthRequest } from "../middlewares/authenticate.js";
import { comparePassword, hashPassword } from "../lib/auth.js";

const router = Router();

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

// GET /api/users/me
router.get("/me", authenticate, async (req: AuthRequest, res) => {
  const [user] = await db
    .select()
    .from(usersTable)
    .where(
      and(eq(usersTable.id, req.userId!), isNull(usersTable.deletedAt)),
    )
    .limit(1);

  if (!user) {
    res.status(404).json({ message: "User not found" });
    return;
  }
  res.json(safeUser(user));
});

// PATCH /api/users/me
router.patch("/me", authenticate, async (req: AuthRequest, res) => {
  const { name, avatarUrl } = req.body as {
    name?: string;
    avatarUrl?: string;
  };

  const updates: Partial<typeof usersTable.$inferInsert> = {
    updatedAt: new Date(),
  };
  if (name) updates.name = name;
  if (avatarUrl !== undefined) updates.avatarUrl = avatarUrl;

  const [updated] = await db
    .update(usersTable)
    .set(updates)
    .where(eq(usersTable.id, req.userId!))
    .returning();

  res.json(safeUser(updated));
});

// DELETE /api/users/me
router.delete("/me", authenticate, async (req: AuthRequest, res) => {
  await db
    .update(usersTable)
    .set({ deletedAt: new Date(), updatedAt: new Date() })
    .where(eq(usersTable.id, req.userId!));

  await db.insert(auditLogsTable).values({
    userId: req.userId!,
    action: "user.soft_delete",
    ipAddress: req.ip,
  });

  // Revoke all sessions
  await db
    .update(sessionsTable)
    .set({ revokedAt: new Date() })
    .where(eq(sessionsTable.userId, req.userId!));

  res.json({ message: "Account scheduled for deletion in 30 days" });
});

// POST /api/users/change-password
router.post("/change-password", authenticate, async (req: AuthRequest, res) => {
  const { oldPassword, newPassword } = req.body as {
    oldPassword?: string;
    newPassword?: string;
  };

  if (!oldPassword || !newPassword || newPassword.length < 8) {
    res.status(400).json({ message: "Invalid input" });
    return;
  }

  const [user] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.id, req.userId!))
    .limit(1);

  if (!user?.passwordHash) {
    res.status(400).json({ message: "Password not set (OAuth account)" });
    return;
  }

  const valid = await comparePassword(oldPassword, user.passwordHash);
  if (!valid) {
    res.status(401).json({ message: "Current password incorrect" });
    return;
  }

  const passwordHash = await hashPassword(newPassword);
  await db
    .update(usersTable)
    .set({ passwordHash, updatedAt: new Date() })
    .where(eq(usersTable.id, req.userId!));

  await db.insert(auditLogsTable).values({
    userId: req.userId!,
    action: "user.change_password",
    ipAddress: req.ip,
  });

  res.json({ message: "Password changed successfully" });
});

// GET /api/users/sessions
router.get("/sessions", authenticate, async (req: AuthRequest, res) => {
  const sessions = await db
    .select({
      id: sessionsTable.id,
      ipAddress: sessionsTable.ipAddress,
      userAgent: sessionsTable.userAgent,
      createdAt: sessionsTable.createdAt,
      expiresAt: sessionsTable.expiresAt,
    })
    .from(sessionsTable)
    .where(
      and(
        eq(sessionsTable.userId, req.userId!),
        isNull(sessionsTable.revokedAt),
      ),
    )
    .orderBy(sessionsTable.createdAt);

  res.json(sessions);
});

export default router;
