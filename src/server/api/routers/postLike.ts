import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const postLikeRouter = createTRPCRouter({
  // Create a new like for a post
  create: publicProcedure
    .input(
      z.object({
        postId: z.string(),
        userId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.postLike.create({
        data: {
          postId: input.postId,
          userId: input.userId,
        },
      });
    }),

  // Get all likes for a post
  getByPostId: publicProcedure
    .input(z.object({ postId: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.postLike.findMany({
        where: { postId: input.postId },
        include: {
          user: true, // Include user who liked the post
        },
      });
    }),

  // Delete a like for a post
  delete: publicProcedure
    .input(
      z.object({
        postId: z.string(),
        userId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.postLike.deleteMany({
        where: {
          postId: input.postId,
          userId: input.userId,
        },
      });
    }),
});
