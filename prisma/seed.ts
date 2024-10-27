import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Create 3 test authors
  const authors = await Promise.all(
    Array.from({ length: 3 }, (_, i) => {
      return prisma.user.create({
        data: {
          clerkId: `clerk_test_user_${i + 1}`,
        },
      });
    })
  );

  // Create 3 test articles, each linked to a random author
  const articles = await Promise.all(
    Array.from({ length: 3 }, (_, i) => {
      return prisma.post.create({
        data: {
          title: `Test Article ${i + 1}`,
          content: `This is the content of test article ${i + 1}.`,
          userId: authors[i % authors.length]!.id,
          isPublished: true,
        },
      });
    })
  );

  // Create 3 comments for each article
  for (const article of articles) {
    await Promise.all(
      Array.from({ length: 3 }, (_, i) => {
        return prisma.comment.create({
          data: {
            postId: article.id,
            userId: authors[i % authors.length]!.id,
            content: `This is a comment ${i + 1} for article ${article.title}.`,
          },
        });
      })
    );
  }

  console.log('Seeding completed!');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
