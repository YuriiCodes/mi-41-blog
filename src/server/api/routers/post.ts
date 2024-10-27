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
          brief: z.string().min(1).max(150),
          readTime: z.number().default(0)
        })
      )
      .mutation(async ({ ctx, input }) => {
        return ctx.db.post.create({
          data: {
            title: input.title,
            content: input.content,
            userId: input.userId,
            isPublished: input.isPublished,
            brief: input.brief,
            readTime: input.readTime
          }
        });
      }),

    getById: publicProcedure
      .input(
        z.object({
          id: z.string()
        })
      ).query(async ({ ctx, input }) => {
          return ctx.db.post.findUnique({
            where: {
              id: input.id
            },
            include: {
              user: true,
              comments: {
                include: {
                  user: true
                }
              },
              postLikes: true
            }
          });
        }
      ),

    // Get the latest post
    getLatest: publicProcedure.query(async ({ ctx }) => {
      const post = await ctx.db.post.findFirst({
        orderBy: { createdAt: "desc" },
        include: {
          user: true, // Include user details
          comments: {
            include: {
              user: true // Include user who commented
            }
          },
          postLikes: true // Include post likes
        }
      });

      return post ?? null;
    }),

    getAll: publicProcedure.query(async ({ ctx }) => {
      return ctx.db.post.findMany({
        include: {
          user: true,
          comments: {
            include: {
              user: true
            }
          },
          postLikes: true
        }
      });
    }),
  })
;
