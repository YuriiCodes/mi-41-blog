import { type Comment } from "@prisma/client";
import { type User } from "@prisma/client";

export type BackendComment = Comment & {
  user: Partial<User>;
}
export type FeComment ={
  id: string;
  author: string;
  content: string;
  date: string;
  replies: FeComment[];
}