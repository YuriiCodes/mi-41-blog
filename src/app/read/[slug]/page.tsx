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
  console.log('blog', blog);
  return (
    <div>
      <h1>Reading ID: {slug}</h1>
      <BlogContent content={blog.content} comments={blog.comments} postId={blog.id}/>
    </div>
  );
};

export default ReadPage;
