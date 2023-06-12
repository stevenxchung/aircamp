import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const campgroundsRouter = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.airCampCampground.findMany();
  }),
});
