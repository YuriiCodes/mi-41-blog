import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const postRouter = createTRPCRouter({
  // Create a new post
  create: publicProcedure
    .input(
      z.object({
        title: z.string().min(1),
        content: z.string().min(1),
        userId: z.string(), // Reference to the user creating the post
        isPublished: z.boolean().optional().default(false),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.post.create({
        data: {
          title: input.title,
          content: input.content,
          userId: input.userId,
          isPublished: input.isPublished,
        },
      });
    }),

  // Get the latest post
  getLatest: publicProcedure.query(async ({ ctx }) => {
    const post = await ctx.db.post.findFirst({
      orderBy: { createdAt: "desc" },
      include: {
        user: true, // Include user details
        comments: {
          include: {
            user: true, // Include user who commented
          },
        },
        postLikes: true, // Include post likes
      },
    });

    return post ?? null;
  }),
});
