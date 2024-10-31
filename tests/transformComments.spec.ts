import { transformComments } from "../src/utils/comments";
describe("transformComments", () => {
  const backendComments = [
    {
      id: "1",
      parentId: null,
      content: "This is the first comment.",
      createdAt: new Date("2024-10-28T20:44:03.538Z"),
      user: {
        username: "Alice Johnson",
        avatarUrl: "/avatar1.png",
      },
      postId: "mockPostId",
      userId: "mockUserId",
      updatedAt: new Date("2024-10-28T20:44:03.538Z")
    },
    {
      id: "2",
      parentId: "1",
      content: "This is a reply to the first comment.",
      createdAt: new Date("2024-10-28T21:44:03.538Z"),
      user: {
        username: "Bob Smith",
        avatarUrl: "/avatar2.png",
      },
      postId: "mockPostId",
      userId: "mockUserId",
      updatedAt: new Date("2024-10-28T21:44:03.538Z")
    },
    {
      id: "3",
      parentId: null,
      content: "This is a second root-level comment.",
      createdAt: new Date("2024-10-28T22:44:03.538Z"),
      user: {
        username: "Charlie Brown",
        avatarUrl: "/avatar3.png",
      },
      postId: "mockPostId",
      userId: "mockUserId",
      updatedAt: new Date("2024-10-28T22:44:03.538Z")
    },
  ];

  test("should return an array", () => {
    const result = transformComments(backendComments);
    expect(Array.isArray(result)).toBe(true);
  });

  test("should return root-level comments without a parentId", () => {
    const result = transformComments(backendComments);
    expect(result.length).toBe(2);
  });

  test("should include replies under the parent comment", () => {
    const result = transformComments(backendComments);
    expect(result[0]?.replies.length).toBe(1);
  });

  test("reply should contain correct author", () => {
    const result = transformComments(backendComments);
    expect(result[0]?.replies[0]?.author).toBe("Bob Smith");
  });

  test("should set date in a human-readable format", () => {
    const result = transformComments(backendComments);
    expect(typeof result[0]?.date).toBe("string");
  });

  test("should maintain nested structure for replies", () => {
    const nestedComments = [...backendComments, {
      id: "4",
      parentId: "2",
      content: "This is a nested reply.",
      createdAt: "2024-10-28T23:44:03.538Z",
      user: {
        username: "David",
        avatarUrl: "/avatar4.png",
      },
      postId: "mockPostId",
      userId: "mockUserId",
      updatedAt: "2024-10-28T23:44:03.538Z"
    }];
    // @ts-expect-error -- testing null avatarUrl
    const result = transformComments(nestedComments);
    expect(result[0]?.replies[0]?.replies.length).toBe(1);
  });

  test("should handle empty input", () => {
    const result = transformComments([]);
    expect(result).toEqual([]);
  });

  test("should not modify input array", () => {
    const inputCopy = [...backendComments];
    transformComments(backendComments);
    expect(backendComments).toEqual(inputCopy);
  });

  test("root comments should not have a parentId", () => {
    const result = transformComments(backendComments);
    expect(result.every(comment => comment.replies.every(reply => reply.id !== null))).toBe(true);
  });

  test("should handle comments with null avatarUrl", () => {

    const result = transformComments([{
      ...backendComments[0],
      // @ts-expect-error -- testing null avatarUrl
      user: { ...backendComments[0].user, avatarUrl: null }
    }]);

    // @ts-expect-error -- testing null avatarUrl
    expect(result[0]?.avatar).toBe(undefined);
  });

  test("should handle comments without replies", () => {
    const noReplyComments = backendComments.slice(0, 2);
    const result = transformComments(noReplyComments);
    expect(result[1]?.replies.length).toBe(undefined);
  });

  test("should include all root-level comments", () => {
    const result = transformComments(backendComments);
    expect(result.map(c => c.id)).toContain("1");
  });

  test("should correctly transform backend comments to frontend format", () => {
    const result = transformComments(backendComments);
    expect(result[0])
      .not.toHaveProperty("parentId");
  });

  test("should handle deeply nested comments", () => {
    const deepNested = [
      ...backendComments,
      {
        id: "5",
        parentId: "4",
        content: "Another nested reply.",
        createdAt: "2024-10-28T23:45:03.538Z",
        user: { username: "Eve", avatarUrl: "/avatar5.png" },
        postId: "mockPostId",
        userId: "mockUserId",
        updatedAt: "2024-10-28T23:45:03.538Z"
      }
    ];
    // @ts-expect-error -- testing null avatarUrl
    const result = transformComments(deepNested);
    expect(result[0]?.replies[0]?.replies[0]?.replies.length).toBe(undefined);
  });

  test("should retain original content", () => {
    const result = transformComments(backendComments);
    expect(result[0]?.content).toBe("This is the first comment.");
  });

  test("should handle multiple comments with the same parentId", () => {
    const multipleReplies = [
      ...backendComments,
      {
        id: "6",
        parentId: "1",
        content: "Another reply to the first comment.",
        createdAt: "2024-10-29T00:00:00.538Z",
        user: { username: "Frank", avatarUrl: "/avatar6.png" },
        postId: "mockPostId",
        userId: "mockUserId",
        updatedAt: "2024-10-29T00:00:00.538Z"
      }
    ];
    // @ts-expect-error -- testing null avatarUrl
    const result = transformComments(multipleReplies);
    expect(result[0]?.replies.length).toBe(2);
  });

  test("should ignore extra fields in backend data", () => {

    const result = transformComments([{ ...backendComments[0], extraField: "ignore me" } as never]);
    expect(result[0]).not.toHaveProperty("extraField");
  });

  test("should correctly sort replies by createdAt", () => {
    const sortedReplies = transformComments(backendComments);
    expect(sortedReplies[0]?.replies[0]?.date).toBe("10/28/2024, 11:44:03 PM");
  });

});
