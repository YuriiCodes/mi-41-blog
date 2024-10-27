import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const commentRouter = createTRPCRouter({
  // Create a new comment
  create: publicProcedure
    .input(
      z.object({
        postId: z.string(),
        userId: z.string(),
        content: z.string().min(1),
        parentId: z.string().optional(), // For nested comments
      })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.comment.create({
        data: {
          postId: input.postId,
          userId: input.userId,
          content: input.content,
          parentId: input.parentId,
        },
      });
    }),

  // Get all comments for a post
  getByPostId: publicProcedure
    .input(z.object({ postId: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.comment.findMany({
        where: { postId: input.postId },
        include: {
          user: true, // Include user who made the comment
          replies: true, // Include replies to the comment
        },
      });
    }),

  // Get comment by ID
  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.comment.findUnique({
        where: { id: input.id },
        include: {
          user: true,
          replies: true,
        },
      });
    }),
});
