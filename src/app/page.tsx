import { Feed } from "~/components/feed";

export default async function Home() {
  return (
    <>
      <h1 className="mb-8 text-3xl font-bold">Latest Blog Posts</h1>
      <Feed />
    </>
  );
}
