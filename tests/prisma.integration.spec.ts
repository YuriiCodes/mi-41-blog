// tests/user.integration.test.ts

import { PrismaClient } from '@prisma/client';
;
const prisma = new PrismaClient();

describe('Prisma ORM Integration Tests for User', () => {
  // Підключення до бази даних перед тестами
  beforeAll(async () => {
    await prisma.$connect();
  });

  // Очищення тестових даних перед кожним тестом
  beforeEach(async () => {
    // Видаляємо всі записи з таблиць, які залежать від `User`
    await prisma.comment.deleteMany();
    await prisma.post.deleteMany();

    // Видаляємо користувачів
    await prisma.user.deleteMany();
  });


  // Закриття з'єднання після тестів
  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('should create a user in the database', async () => {
    const user = await prisma.user.create({
      data: {
        clerkId: 'clerk_test_user_1',
        username: 'testuser1',
        email: 'testuser1@example.com',
      },
    });

    expect(user).toHaveProperty('clerkId', 'clerk_test_user_1');
    expect(user.username).toBe('testuser1');
    expect(user.email).toBe('testuser1@example.com');
  });

  it('should retrieve a user by clerkId from the database', async () => {
    await prisma.user.create({
      data: {
        clerkId: 'clerk_test_user_2',
        username: 'testuser2',
        email: 'testuser2@example.com',
      },
    });

    const user = await prisma.user.findUnique({
      where: { clerkId: 'clerk_test_user_2' },
    });

    expect(user).not.toBeNull();
    expect(user?.clerkId).toBe('clerk_test_user_2');
    expect(user?.username).toBe('testuser2');
    expect(user?.email).toBe('testuser2@example.com');
  });
});
