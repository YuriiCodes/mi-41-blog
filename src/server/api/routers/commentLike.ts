import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const commentLikeRouter = createTRPCRouter({
  // Create a new like for a comment
  create: publicProcedure
    .input(
      z.object({
        commentId: z.string(),
        userId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.commentLike.create({
        data: {
          commentId: input.commentId,
          userId: input.userId,
        },
      });
    }),

  // Get all likes for a comment
  getByCommentId: publicProcedure
    .input(z.object({ commentId: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.commentLike.findMany({
        where: { commentId: input.commentId },
        include: {
          user: true, // Include user who liked the comment
        },
      });
    }),

  // Delete a like for a comment
  delete: publicProcedure
    .input(
      z.object({
        commentId: z.string(),
        userId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.commentLike.deleteMany({
        where: {
          commentId: input.commentId,
          userId: input.userId,
        },
      });
    }),
});
