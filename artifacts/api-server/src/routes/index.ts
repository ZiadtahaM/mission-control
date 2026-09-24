import { Router, type IRouter } from "express";
import healthRouter from "./health.js";
import authRouter from "./auth.js";
import usersRouter from "./users.js";
import paymentsRouter from "./payments.js";
import dashboardRouter from "./dashboard.js";
import adminRouter from "./admin.js";

const router: IRouter = Router();

router.use(healthRouter);
router.use("/auth", authRouter);
router.use("/users", usersRouter);
router.use("/payments", paymentsRouter);
router.use("/dashboard", dashboardRouter);
router.use("/admin", adminRouter);

export default router;
