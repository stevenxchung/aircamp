import { TRPCError } from "@trpc/server";
import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

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

  create: protectedProcedure
    .input(
      z.object({
        summary: z.string(),
        description: z.string(),
        imageSource: z.string(),
        name: z.string(),
        price: z.string(),
        location: z.string(),
        lat: z.number(),
        lng: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const id = ctx.session.user.id;

      const post = await ctx.prisma.airCampCampground.create({
        data: {
          airCampUserId: id,
          summary: input.summary,
          description: input.description,
          imageSource: input.imageSource,
          name: input.name,
          price: input.price,
          location: input.location,
          lat: input.lat,
          lng: input.lng,
        },
      });

      return post;
    }),
});
