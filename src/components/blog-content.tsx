import { type FC } from "react";
import xss from "xss";

interface Props {
  content: string;
}

export const BlogContent: FC<Props> = ({ content }) => (
  <article
    className={"prose lg:prose-xl"}
    dangerouslySetInnerHTML={{ __html: xss(content) }}
  />
);
