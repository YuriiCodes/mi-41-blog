import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import xss from "xss";
import readingTime from "reading-time";

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
          slug: z.string().min(1),
        })
      )
      .mutation(async ({ ctx, input }) => {
        return ctx.db.post.create({
          data: {
            title: input.title,
            content: xss(input.content),
            userId: input.userId,
            isPublished: input.isPublished,
            brief: input.brief,
            readTime: readingTime(input.content).minutes,
            slug: input.slug
          }
        });
      }),

    getBySlug: publicProcedure
      .input(
        z.object({
          slug: z.string()
        })
      ).query(async ({ ctx, input }) => {
          return ctx.db.post.findUnique({
            where: {
              slug: input.slug
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
