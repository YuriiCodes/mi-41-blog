import { type FC } from "react";
import { api } from "~/trpc/server";
import { BlogContent } from "~/components/blog-content";
import { notFound } from "next/navigation";
// This is a server component
const ReadPage: FC<{ params: { slug: string } }> = async ({ params }) => {
  const { slug } = params;
  const blog = await api.post.getBySlug({
    slug,
  });

  // Fetch data using the ID from the server (if needed)
  // Example: const data = await fetchData(ID);

  // 404:
  if (!blog || !blog.content) {
    return notFound();
  }
  return (
    <div>
      <h1>Reading ID: {slug}</h1>
      <BlogContent content={blog.content} />
    </div>
  );
};

export default ReadPage;
