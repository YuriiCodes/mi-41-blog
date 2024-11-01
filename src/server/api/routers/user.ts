import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const userRouter = createTRPCRouter({
  // Get user by Clerk ID
  getByClerkId: publicProcedure
    .input(z.object({ clerkId: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.user.findUnique({
        where: { clerkId: input.clerkId },
      });
    }),

  // Create a new user
  create: publicProcedure
    .input(z.object({ clerkId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.user.create({
        data: {
          clerkId: input.clerkId,
        },
      });
    }),

  // upsert:
  upsert: protectedProcedure
    .input(
      z.object({
        clerkId: z.string(),
        username: z.string(),
        email: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.user.upsert({
        where: { clerkId: input.clerkId },
        create: {
          clerkId: input.clerkId,
          username: input.username,
          email: input.email,
        },
        update: {
          username: input.username,
          email: input.email,
        },
      });
    }),

  // Get all users
  getAll: publicProcedure.query(async ({ ctx }) => {
    return ctx.db.user.findMany();
  }),
});
