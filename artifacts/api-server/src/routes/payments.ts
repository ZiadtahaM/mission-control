import { Router } from "express";
import { db } from "@workspace/db";
import {
  usersTable,
  subscriptionsTable,
  paymentEventsTable,
} from "@workspace/db";
import { eq } from "drizzle-orm";
import { authenticate, AuthRequest } from "../middlewares/authenticate.js";

const router = Router();

const PLAN_PRICES = {
  PRO: {
    priceId: process.env["STRIPE_PRO_PRICE_ID"] || "price_pro",
    amount: 2900,
  },
  ENTERPRISE: {
    priceId: process.env["STRIPE_ENTERPRISE_PRICE_ID"] || "price_enterprise",
    amount: 9900,
  },
};

// POST /api/payments/checkout
router.post("/checkout", authenticate, async (req: AuthRequest, res) => {
  const { plan } = req.body as { plan?: string };

  if (!plan || !["PRO", "ENTERPRISE"].includes(plan)) {
    res.status(400).json({ message: "Invalid plan" });
    return;
  }

  const stripeKey = process.env["STRIPE_SECRET_KEY"];
  if (!stripeKey) {
    res.status(503).json({
      message: "Stripe not configured. Add STRIPE_SECRET_KEY to enable payments.",
    });
    return;
  }

  try {
    const [user] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, req.userId!))
      .limit(1);

    const Stripe = (await import("stripe")).default;
    const stripe = new Stripe(stripeKey);

    const priceId = PLAN_PRICES[plan as keyof typeof PLAN_PRICES].priceId;
    const baseUrl = process.env["APP_URL"] || "http://localhost:3000";

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      customer_email: user.email,
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${baseUrl}/billing?success=true`,
      cancel_url: `${baseUrl}/billing?canceled=true`,
      metadata: { userId: user.id, plan },
    });

    res.json({ url: session.url });
  } catch (err) {
    res.status(500).json({ message: "Failed to create checkout session" });
  }
});

// GET /api/payments/portal
router.get("/portal", authenticate, async (req: AuthRequest, res) => {
  const stripeKey = process.env["STRIPE_SECRET_KEY"];
  if (!stripeKey) {
    res.json({ url: "/billing" });
    return;
  }

  const [user] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.id, req.userId!))
    .limit(1);

  if (!user.stripeCustomerId) {
    res.json({ url: "/billing" });
    return;
  }

  try {
    const Stripe = (await import("stripe")).default;
    const stripe = new Stripe(stripeKey);
    const baseUrl = process.env["APP_URL"] || "http://localhost:3000";
    const session = await stripe.billingPortal.sessions.create({
      customer: user.stripeCustomerId,
      return_url: `${baseUrl}/billing`,
    });
    res.json({ url: session.url });
  } catch {
    res.json({ url: "/billing" });
  }
});

// GET /api/payments/invoices
router.get("/invoices", authenticate, async (req: AuthRequest, res) => {
  const page = parseInt(String(req.query["page"] || "1"));
  const limit = parseInt(String(req.query["limit"] || "10"));

  const events = await db
    .select()
    .from(paymentEventsTable)
    .where(eq(paymentEventsTable.userId, req.userId!))
    .orderBy(paymentEventsTable.createdAt)
    .limit(limit)
    .offset((page - 1) * limit);

  const invoices = events.map((e) => ({
    id: String(e.id),
    amount: (e.amountCents || 0) / 100,
    currency: e.currency || "usd",
    status: e.status || "paid",
    createdAt: e.createdAt,
    pdfUrl: null,
  }));

  res.json({ data: invoices, total: invoices.length, page, limit });
});

// GET /api/payments/subscription
router.get("/subscription", authenticate, async (req: AuthRequest, res) => {
  const [user] = await db
    .select({ plan: usersTable.plan })
    .from(usersTable)
    .where(eq(usersTable.id, req.userId!))
    .limit(1);

  const [sub] = await db
    .select()
    .from(subscriptionsTable)
    .where(eq(subscriptionsTable.userId, req.userId!))
    .orderBy(subscriptionsTable.createdAt)
    .limit(1);

  res.json({
    id: sub?.id || null,
    plan: user.plan,
    status: sub?.status || "active",
    currentPeriodStart: sub?.currentPeriodStart || null,
    currentPeriodEnd: sub?.currentPeriodEnd || null,
    cancelAt: sub?.cancelAt || null,
  });
});

// POST /api/payments/webhook
router.post("/webhook", async (req, res) => {
  const stripeKey = process.env["STRIPE_SECRET_KEY"];
  const webhookSecret = process.env["STRIPE_WEBHOOK_SECRET"];

  if (!webhookSecret) {
    res.status(400).json({ message: "Webhook secret not configured" });
    return;
  }

  const sig = req.headers["stripe-signature"] as string;
  if (!sig) {
    res.status(400).json({ message: "Missing stripe-signature header" });
    return;
  }

  let event;
  try {
    const Stripe = (await import("stripe")).default;
    const stripe = new Stripe(stripeKey || "sk_test_placeholder");
    event = stripe.webhooks.constructEvent(req.body as Buffer, sig, webhookSecret);
  } catch {
    res.status(400).json({ message: "Invalid webhook signature" });
    return;
  }

  try {

  const data = event.data.object as {
      id: string;
      customer?: string;
      metadata?: { userId?: string; plan?: string };
      amount_paid?: number;
      currency?: string;
    };

  const userId = data.metadata?.userId;

  if (userId) {
    await db.insert(paymentEventsTable).values({
      userId,
      stripeEventId: event.id,
      eventType: event.type,
      amountCents: data.amount_paid,
      currency: data.currency,
      status: "processed",
      metadata: data as object,
    });

    if (
      event.type === "customer.subscription.created" ||
      event.type === "customer.subscription.updated"
    ) {
      const planMeta = data.metadata?.plan;
      if (planMeta && ["FREE", "PRO", "ENTERPRISE"].includes(planMeta)) {
        await db
          .update(usersTable)
          .set({
            plan: planMeta as "FREE" | "PRO" | "ENTERPRISE",
            updatedAt: new Date(),
          })
          .where(eq(usersTable.id, userId));
      }
    }

    if (event.type === "customer.subscription.deleted") {
      await db
        .update(usersTable)
        .set({ plan: "FREE", updatedAt: new Date() })
        .where(eq(usersTable.id, userId));
    }
  }

  res.json({ message: "ok" });
  } catch {
    res.status(500).json({ message: "Webhook processing error" });
  }
});

export default router;
