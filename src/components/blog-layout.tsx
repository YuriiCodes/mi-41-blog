"use server";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { CalendarIcon, ClockIcon } from "lucide-react";
import { api } from "~/trpc/server";

export const BlogLayout = async () => {
  const posts = await api.post.getAll();
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold">Latest Blog Posts</h1>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post, index) => (
          <Card key={index} className="flex flex-col">
            <CardHeader>
              <CardTitle>{post.title}</CardTitle>
              <CardDescription>{post.brief}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <Badge>{post.user.username}</Badge>
            </CardContent>
            <CardFooter className="flex justify-between text-sm text-muted-foreground">
              <div className="flex items-center">
                <CalendarIcon className="mr-1 h-4 w-4" />
                {new Date(post.createdAt).toLocaleDateString()}
              </div>
              <div className="flex items-center">
                <ClockIcon className="mr-1 h-4 w-4" />
                {post.readTime}
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};
