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
  getMySubscriptions: privateProcedure
    .input(
      z.object({
        filter: z
          .object({
            status: z.enum(subscriptionSchema.status.enumValues).optional(),
          })
          .optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { filter } = input;
      const where =
        filter && filter.status
          ? and(
              eq(subscriptionSchema.userId, ctx.user.id),
              eq(subscriptionSchema.status, filter.status)
            )
          : eq(subscriptionSchema.userId, ctx.user.id);

      const subscriptions = await db
        .select()
        .from(subscriptionSchema)
        .where(where)
        .orderBy(
          subscriptionSchema.status,
          subscriptionSchema.currentPeriodEnd
        );

      return subscriptions;
    }),
});
