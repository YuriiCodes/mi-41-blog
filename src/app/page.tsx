import { BlogLayout } from "~/components/blog-layout";
import {  HydrateClient } from "~/trpc/server";

export default async function Home() {
  // const hello = await api.post.hello({ text: "from tRPC" });
  //
  // void api.post.getLatest.prefetch();
  return (
    <HydrateClient>
      <BlogLayout />
      {/*<main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b  prose lg:prose-xl">*/}
      {/*  <h1 >Hello, tRPC!</h1>*/}
      {/*  <p >This is a page that uses tRPC.</p>*/}
      {/*</main>*/}
    </HydrateClient>
  );
}
