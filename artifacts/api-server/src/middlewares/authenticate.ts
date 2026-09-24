import { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../lib/auth.js";

export interface AuthRequest extends Request {
  userId?: string;
  userRole?: string;
  userPlan?: string;
}

export function authenticate(
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): void {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    res.status(401).json({ message: "No token provided" });
    return;
  }
  const token = authHeader.slice(7);
  try {
    const payload = verifyAccessToken(token);
    req.userId = payload.userId;
    req.userRole = payload.role;
    req.userPlan = payload.plan;
    next();
  } catch {
    res.status(401).json({ message: "Invalid or expired token" });
  }
}

export function requireRole(...roles: string[]) {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.userId) {
      res.status(401).json({ message: "Not authenticated" });
      return;
    }
    if (!roles.includes(req.userRole || "")) {
      res.status(403).json({ message: "Insufficient permissions" });
      return;
    }
    next();
  };
}
