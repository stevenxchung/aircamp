import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const campgroundsRouter = createTRPCRouter({
  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const campground = await ctx.prisma.airCampCampground.findUnique({
        where: { id: input.id },
        include: {
          owner: true,
        },
      });

      if (!campground) throw new TRPCError({ code: "NOT_FOUND" });

      return campground;
    }),

  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.airCampCampground.findMany();
  }),
});
