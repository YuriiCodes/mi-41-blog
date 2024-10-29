import { type FC } from "react";
import { Comments } from "~/components/blog-post";

import { transformComments } from "~/utils/comments";
import { type BackendComment } from "~/types";

interface Props {
  content: string;
  comments?: BackendComment[];
  isShowComments?: boolean;
  postId?: string;
}

export const BlogContent: FC<Props> = async ({
  content,
  comments,
  postId,
  isShowComments = true,
}) => (
  <>
    <article
      className={"prose lg:prose-xl"}
      dangerouslySetInnerHTML={{ __html: content }}
    />
    {isShowComments && postId && (
      <Comments postId={postId} comments={transformComments(comments)} />
    )}
  </>
);
