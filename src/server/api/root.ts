import { createTRPCRouter } from "~/server/api/trpc";
import { paymentsRouter } from "./routers/stripe";
import { subscriptionsRouter } from "./routers/subscriptions";
import { invoiceRouter } from "./routers/invoices";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  payments: paymentsRouter,
  subscriptions: subscriptionsRouter,
  invoices: invoiceRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
