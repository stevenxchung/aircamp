import { createTRPCRouter } from "~/server/api/trpc";
import { campgroundsRouter } from "./routers/campgrounds";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  campgrounds: campgroundsRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
