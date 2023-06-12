import { exampleRouter } from "~/server/api/routers/example";
import { customerRouter } from "./routers/stripe";
import { createTRPCRouter } from "~/server/api/trpc";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  example: exampleRouter,
  payment: customerRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
