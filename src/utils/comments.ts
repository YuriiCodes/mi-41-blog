import { type BackendComment, type FeComment } from "~/types";

export const transformComments = (backendComments?: BackendComment[]): FeComment[] => {

  if(!backendComments) return [];

  const commentMap: Record<string, FeComment> = {};

  // Create a map of all comments
  backendComments.forEach((comment) => {
    commentMap[comment.id] = {
      id: comment.id,
      author: comment.user.username ?? "",
      content: comment.content,
      date: new Date(comment.createdAt).toLocaleString(),
      replies: [],
    };
  });

  // Create nested comment structure
  const rootComments: FeComment[] = [];
  backendComments.forEach((comment) => {
    const currComm = commentMap[comment.id]
    if (comment.parentId && currComm) {
      commentMap[comment.parentId]?.replies.push(currComm);
    } else {
      if (currComm) {
        rootComments.push(currComm);
      }
    }
  });

  return rootComments;
};