import { Router } from "express";
import { db } from "@workspace/db";
import {
  usersTable,
  sessionsTable,
  auditLogsTable,
} from "@workspace/db";
import { eq, and, gt, isNull } from "drizzle-orm";
import {
  hashPassword,
  comparePassword,
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
  hashToken,
  generateSecureToken,
  REFRESH_TOKEN_EXPIRY_MS,
} from "../lib/auth.js";
import { authenticate, AuthRequest } from "../middlewares/authenticate.js";
import { RegisterBody, LoginBody } from "@workspace/api-zod";
import { authLimiter } from "../middlewares/rate-limit.js";

const router = Router();

async function logAudit(
  userId: string | null,
  action: string,
  ip?: string,
  payload?: object,
) {
  await db.insert(auditLogsTable).values({
    userId: userId ?? undefined,
    action,
    ipAddress: ip,
    payload: payload ?? null,
  });
}

function userResponse(user: {
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

// POST /api/auth/register
router.post("/register", authLimiter, async (req: AuthRequest, res) => {
  const parse = RegisterBody.safeParse(req.body);
  if (!parse.success) {
    const first = parse.error.errors[0];
    res.status(400).json({
      field: String(first?.path?.[0] ?? "input"),
      message: first?.message ?? "Invalid input",
    });
    return;
  }
  const { email, password, name } = parse.data;

  const existing = await db
    .select({ id: usersTable.id })
    .from(usersTable)
    .where(eq(usersTable.email, email.toLowerCase()))
    .limit(1);

  if (existing.length > 0) {
    res.status(409).json({ message: "Email already in use" });
    return;
  }

  const passwordHash = await hashPassword(password);
  const verificationToken = generateSecureToken();

  const [user] = await db
    .insert(usersTable)
    .values({
      email: email.toLowerCase(),
      passwordHash,
      name,
      emailVerificationToken: verificationToken,
      emailVerificationExpiry: new Date(Date.now() + 24 * 60 * 60 * 1000),
    })
    .returning();

  const accessToken = generateAccessToken({
    userId: user.id,
    role: user.role,
    plan: user.plan,
  });
  const refreshToken = generateRefreshToken({
    userId: user.id,
    role: user.role,
    plan: user.plan,
  });

  await db.insert(sessionsTable).values({
    userId: user.id,
    refreshTokenHash: hashToken(refreshToken),
    ipAddress: req.ip,
    userAgent: req.headers["user-agent"],
    expiresAt: new Date(Date.now() + REFRESH_TOKEN_EXPIRY_MS),
  });

  await logAudit(user.id, "user.register", req.ip, { email });

  res.status(201).json({
    accessToken,
    refreshToken,
    user: userResponse(user),
  });
});

// POST /api/auth/login
router.post("/login", authLimiter, async (req: AuthRequest, res) => {
  const parse = LoginBody.safeParse(req.body);
  if (!parse.success) {
    const first = parse.error.errors[0];
    res.status(400).json({
      field: String(first?.path?.[0] ?? "input"),
      message: first?.message ?? "Invalid input",
    });
    return;
  }
  const { email, password } = parse.data;

  const [user] = await db
    .select()
    .from(usersTable)
    .where(
      and(eq(usersTable.email, email.toLowerCase()), isNull(usersTable.deletedAt)),
    )
    .limit(1);

  if (!user || !user.passwordHash) {
    res.status(401).json({ message: "Invalid credentials" });
    return;
  }

  if (user.banned) {
    res.status(403).json({ message: "Account suspended" });
    return;
  }

  const valid = await comparePassword(password, user.passwordHash);
  if (!valid) {
    res.status(401).json({ message: "Invalid credentials" });
    return;
  }

  const accessToken = generateAccessToken({
    userId: user.id,
    role: user.role,
    plan: user.plan,
  });
  const refreshToken = generateRefreshToken({
    userId: user.id,
    role: user.role,
    plan: user.plan,
  });

  await db.insert(sessionsTable).values({
    userId: user.id,
    refreshTokenHash: hashToken(refreshToken),
    ipAddress: req.ip,
    userAgent: req.headers["user-agent"],
    expiresAt: new Date(Date.now() + REFRESH_TOKEN_EXPIRY_MS),
  });

  await logAudit(user.id, "user.login", req.ip, { email });

  res.json({ accessToken, refreshToken, user: userResponse(user) });
});

// POST /api/auth/refresh
router.post("/refresh", async (req, res) => {
  const { refreshToken } = req.body as { refreshToken?: string };
  if (!refreshToken) {
    res.status(401).json({ message: "Refresh token required" });
    return;
  }

  let payload;
  try {
    payload = verifyRefreshToken(refreshToken);
  } catch {
    res.status(401).json({ message: "Invalid refresh token" });
    return;
  }

  const tokenHash = hashToken(refreshToken);
  const [session] = await db
    .select()
    .from(sessionsTable)
    .where(
      and(
        eq(sessionsTable.refreshTokenHash, tokenHash),
        isNull(sessionsTable.revokedAt),
        gt(sessionsTable.expiresAt, new Date()),
      ),
    )
    .limit(1);

  if (!session) {
    res.status(401).json({ message: "Invalid or revoked refresh token" });
    return;
  }

  const [user] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.id, session.userId))
    .limit(1);

  if (!user || user.banned) {
    res.status(401).json({ message: "User unavailable" });
    return;
  }

  // Rotate tokens
  await db
    .update(sessionsTable)
    .set({ revokedAt: new Date() })
    .where(eq(sessionsTable.id, session.id));

  const newAccessToken = generateAccessToken({
    userId: user.id,
    role: user.role,
    plan: user.plan,
  });
  const newRefreshToken = generateRefreshToken({
    userId: user.id,
    role: user.role,
    plan: user.plan,
  });

  await db.insert(sessionsTable).values({
    userId: user.id,
    refreshTokenHash: hashToken(newRefreshToken),
    ipAddress: session.ipAddress,
    userAgent: session.userAgent,
    expiresAt: new Date(Date.now() + REFRESH_TOKEN_EXPIRY_MS),
  });

  res.json({
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
    user: userResponse(user),
  });
});

// POST /api/auth/logout
router.post("/logout", authenticate, async (req: AuthRequest, res) => {
  const { refreshToken } = req.body as { refreshToken?: string };
  if (refreshToken) {
    const tokenHash = hashToken(refreshToken);
    await db
      .update(sessionsTable)
      .set({ revokedAt: new Date() })
      .where(eq(sessionsTable.refreshTokenHash, tokenHash));
  }
  await logAudit(req.userId!, "user.logout", req.ip);
  res.json({ message: "Logged out successfully" });
});

// POST /api/auth/forgot-password
router.post("/forgot-password", async (req, res) => {
  const { email } = req.body as { email?: string };
  if (!email) {
    res.status(400).json({ message: "Email required" });
    return;
  }

  const [user] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.email, email.toLowerCase()))
    .limit(1);

  // Always return success to prevent email enumeration
  if (user) {
    const token = generateSecureToken();
    await db
      .update(usersTable)
      .set({
        passwordResetToken: hashToken(token),
        passwordResetExpiry: new Date(Date.now() + 60 * 60 * 1000),
        updatedAt: new Date(),
      })
      .where(eq(usersTable.id, user.id));
    await logAudit(user.id, "auth.forgot_password", req.ip);
  }

  res.json({ message: "If that email exists, a reset link has been sent." });
});

// POST /api/auth/reset-password
router.post("/reset-password", async (req, res) => {
  const { token, password } = req.body as { token?: string; password?: string };
  if (!token || !password || password.length < 8) {
    res.status(400).json({ message: "Invalid input" });
    return;
  }

  const tokenHash = hashToken(token);
  const [user] = await db
    .select()
    .from(usersTable)
    .where(
      and(
        eq(usersTable.passwordResetToken, tokenHash),
        gt(usersTable.passwordResetExpiry!, new Date()),
      ),
    )
    .limit(1);

  if (!user) {
    res.status(400).json({ message: "Invalid or expired reset token" });
    return;
  }

  const passwordHash = await hashPassword(password);
  await db
    .update(usersTable)
    .set({
      passwordHash,
      passwordResetToken: null,
      passwordResetExpiry: null,
      updatedAt: new Date(),
    })
    .where(eq(usersTable.id, user.id));

  // Revoke all sessions
  await db
    .update(sessionsTable)
    .set({ revokedAt: new Date() })
    .where(eq(sessionsTable.userId, user.id));

  await logAudit(user.id, "auth.reset_password", req.ip);
  res.json({ message: "Password reset successfully" });
});

// POST /api/auth/verify-email
router.post("/verify-email", async (req, res) => {
  const { token } = req.body as { token?: string };
  if (!token) {
    res.status(400).json({ message: "Token required" });
    return;
  }

  const [user] = await db
    .select()
    .from(usersTable)
    .where(
      and(
        eq(usersTable.emailVerificationToken, token),
        gt(usersTable.emailVerificationExpiry!, new Date()),
      ),
    )
    .limit(1);

  if (!user) {
    res.status(400).json({ message: "Invalid or expired verification token" });
    return;
  }

  await db
    .update(usersTable)
    .set({
      emailVerified: true,
      emailVerificationToken: null,
      emailVerificationExpiry: null,
      updatedAt: new Date(),
    })
    .where(eq(usersTable.id, user.id));

  await logAudit(user.id, "auth.verify_email", req.ip);
  res.json({ message: "Email verified successfully" });
});

// POST /api/auth/2fa/setup
router.post("/2fa/setup", authenticate, async (req: AuthRequest, res) => {
  const speakeasy = await import("speakeasy");
  const secret = speakeasy.generateSecret({
    name: `LaunchKit (${req.userId})`,
    length: 20,
  });

  const QRCode = await import("qrcode");
  const qrCodeUrl = await QRCode.toDataURL(secret.otpauth_url || "");

  // Store secret temporarily (not enabled yet)
  await db
    .update(usersTable)
    .set({ twoFactorSecret: secret.base32, updatedAt: new Date() })
    .where(eq(usersTable.id, req.userId!));

  res.json({
    secret: secret.base32,
    qrCodeUrl,
    backupCodes: Array.from({ length: 8 }, () =>
      generateSecureToken().slice(0, 8),
    ),
  });
});

// POST /api/auth/2fa/verify
router.post("/2fa/verify", authenticate, async (req: AuthRequest, res) => {
  const { totpCode } = req.body as { totpCode?: string };
  if (!totpCode) {
    res.status(400).json({ message: "TOTP code required" });
    return;
  }

  const [user] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.id, req.userId!))
    .limit(1);

  if (!user?.twoFactorSecret) {
    res.status(400).json({ message: "2FA not set up" });
    return;
  }

  const speakeasy = await import("speakeasy");
  const valid = speakeasy.totp.verify({
    secret: user.twoFactorSecret,
    encoding: "base32",
    token: totpCode,
    window: 1,
  });

  if (!valid) {
    res.status(400).json({ message: "Invalid TOTP code" });
    return;
  }

  await db
    .update(usersTable)
    .set({ twoFactorEnabled: true, updatedAt: new Date() })
    .where(eq(usersTable.id, req.userId!));

  await logAudit(req.userId!, "auth.2fa_enabled", req.ip);
  res.json({ message: "2FA enabled successfully" });
});

// POST /api/auth/2fa/disable
router.post("/2fa/disable", authenticate, async (req: AuthRequest, res) => {
  const { totpCode } = req.body as { totpCode?: string };
  if (!totpCode) {
    res.status(400).json({ message: "TOTP code required" });
    return;
  }

  const [user] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.id, req.userId!))
    .limit(1);

  if (!user?.twoFactorSecret || !user.twoFactorEnabled) {
    res.status(400).json({ message: "2FA not enabled" });
    return;
  }

  const speakeasy = await import("speakeasy");
  const valid = speakeasy.totp.verify({
    secret: user.twoFactorSecret,
    encoding: "base32",
    token: totpCode,
    window: 1,
  });

  if (!valid) {
    res.status(400).json({ message: "Invalid TOTP code" });
    return;
  }

  await db
    .update(usersTable)
    .set({
      twoFactorEnabled: false,
      twoFactorSecret: null,
      updatedAt: new Date(),
    })
    .where(eq(usersTable.id, req.userId!));

  await logAudit(req.userId!, "auth.2fa_disabled", req.ip);
  res.json({ message: "2FA disabled successfully" });
});

export default router;
