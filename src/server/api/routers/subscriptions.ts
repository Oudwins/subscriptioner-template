import { z } from "zod";
import { createTRPCRouter, privateProcedure } from "~/server/api/trpc";
import { db } from "~/db";
import {
  subscriptionSchema,
  SubscriptionSchema,
  invoiceSchema,
  InvoiceSchema,
} from "~/db/schema";
import { eq, and, asc, desc, or } from "drizzle-orm";

export const subscriptionsRouter = createTRPCRouter({
  getMySubscriptions: privateProcedure.query(async ({ ctx, input }) => {
    const subscriptions = await db
      .select()
      .from(subscriptionSchema)
      .where(eq(subscriptionSchema.userId, ctx.user.id));

    return subscriptions;
  }),
});
