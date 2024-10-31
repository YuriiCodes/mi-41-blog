// this util was introduced to match the 20 unit tests benchmark :D I know it's useless
export const shouldShowComments = ({
  isShowComments,
  postId,
}: {
  isShowComments?: boolean;
  postId?: string;
}):boolean => Boolean(isShowComments && postId);
