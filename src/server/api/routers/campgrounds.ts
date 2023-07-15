import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const campgroundsRouter = createTRPCRouter({
  getByPostId: publicProcedure
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

  getByUserId: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const campgrounds = await ctx.prisma.airCampCampground.findMany({
        where: { airCampUserId: input.id },
      });

      if (!campgrounds) throw new TRPCError({ code: "NOT_FOUND" });

      return campgrounds;
    }),

  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.airCampCampground.findMany();
  }),
});
