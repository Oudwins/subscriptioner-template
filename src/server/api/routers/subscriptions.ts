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
import { TRPCError } from "@trpc/server";

import { cancelStripeSubscriptionAtPeriodEnd } from "~/server/stripe/utils";

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
  cancelSubscriptionAtPeriodEnd: privateProcedure
    .input(z.object({ subscriptionId: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      const subscription = await db
        .select()
        .from(subscriptionSchema)
        .where(eq(subscriptionSchema.id, input.subscriptionId))
        .limit(1);

      if (!subscription[0])
        return new TRPCError({
          code: "NOT_FOUND",
          message: "Subscriptin does not exist",
        });
      if (subscription[0].userId !== ctx.user.id)
        return new TRPCError({ code: "FORBIDDEN" });
      if (subscription[0].status !== "active")
        return new TRPCError({
          code: "BAD_REQUEST",
          message: "Subscription is not active",
        });

      const res = await cancelStripeSubscriptionAtPeriodEnd({
        subscriptionId: input.subscriptionId,
      });

      console.log(res);

      if (res.status === "error")
        return new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Something went wrong",
        });

      return res.data;
    }),
});
