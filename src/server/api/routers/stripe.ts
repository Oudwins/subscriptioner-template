import { z } from "zod";
import { createTRPCRouter, privateProcedure } from "~/server/api/trpc";
import {
  findOrCreateCustomerId,
  createSubscriptionCheckout,
} from "~/server/stripe/utils";

export const paymentsRouter = createTRPCRouter({
  createCustomer: privateProcedure.query(async ({ ctx }) => {
    const customerId = await findOrCreateCustomerId({ user: ctx.user });
    return {
      message: `customerId: ${customerId}`,
    };
  }),
  createSubscriptionCheckout: privateProcedure
    .input(z.object({ priceId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const res = await createSubscriptionCheckout({
        user: ctx.user,
        priceId: input.priceId,
        successUrl: "/",
      });
      return res;
    }),
});
