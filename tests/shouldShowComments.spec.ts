import {shouldShowComments} from "../src/utils/shouldShowComments";

describe("shouldShowComments", () => {
  test("should return false if isShowComments is false", () => {
    const result = shouldShowComments({ isShowComments: false, postId: "mockPostId" });
    expect(result).toBe(false);
  });

  test("should return false if postId is not provided", () => {
    const result = shouldShowComments({ isShowComments: true });
    expect(result).toBe(false);
  });

  test("should return true if both isShowComments and postId are provided", () => {
    const result = shouldShowComments({ isShowComments: true, postId: "mockPostId" });
    expect(result).toBe(true);
  });
});