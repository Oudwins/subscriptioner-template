import { z } from "zod";
import { createTRPCRouter, privateProcedure } from "~/server/api/trpc";
import { dbHighLevel, db } from "~/db";
import { invoiceSchema } from "~/db/schema";
import { eq, and, asc, desc, or, ne } from "drizzle-orm";

export const invoiceRouter = createTRPCRouter({
  getMyInvoices: privateProcedure
    .input(
      z.object({
        filter: z
          .object({
            subscriptionId: z.string().optional(),
          })
          .optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { filter } = input;
      const where =
        filter && filter.subscriptionId
          ? and(
              and(
                eq(invoiceSchema.userId, ctx.user.id),
                ne(invoiceSchema.status, "draft")
              ),
              eq(invoiceSchema.subscriptionId, filter.subscriptionId)
            )
          : and(
              eq(invoiceSchema.userId, ctx.user.id),
              ne(invoiceSchema.status, "draft")
            );

      const invoices = dbHighLevel.query.invoiceSchema.findMany({
        where,
        with: {
          subscription: true,
        },
        orderBy: [invoiceSchema.status, invoiceSchema.createdAt],
      });

      return invoices;
    }),
});
