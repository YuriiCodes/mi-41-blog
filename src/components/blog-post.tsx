"use client";

import { useState } from "react";
import { Avatar, AvatarFallback } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Textarea } from "~/components/ui/textarea";
import { MessageSquare } from "lucide-react";
import { type FeComment } from "~/types";
import { api } from "~/trpc/react";
import { SignedIn, SignedOut, SignInButton, useUser } from "@clerk/nextjs";
import toast from "react-hot-toast";


interface CommentsProps {
  comments?: FeComment[];
  postId: string;
}

export function Comments({ comments, postId }: CommentsProps) {
  const [newComment, setNewComment] = useState("");
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const { user } = useUser();

  const util = api.useUtils();
  const { mutateAsync } = api.comment.create.useMutation({
    onSuccess:() => {
      void util.comment.invalidate();
    }
  });

  const handleSubmitComment = (parentId: string | undefined = undefined) => {
    if (!user) toast.error("You must be logged in to comment");
    console.log('userID', user?.id);
    const promise = mutateAsync({
      content: newComment,
      postId,
      parentId,
      userId: user?.id ?? "",
    });

    void toast.promise(promise, {
      loading: "Posting comment...",
      success: "Comment posted! It will appear soon",
      error: "Failed to post comment",
    });
  };

  const renderComments = (commentsToRender?: FeComment[], isReply = false) => {
    if (!commentsToRender) return <p>No comments yet</p>;

    return commentsToRender.map((comment) => (
      <Card key={comment.id} className={`mb-4 ${isReply ? "ml-8" : ""}`}>
        <CardHeader className="flex flex-row items-center gap-4">
          <Avatar>
            <AvatarFallback>{comment.author[0]}</AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-lg">{comment.author}</CardTitle>
            <p className="text-sm text-muted-foreground">{comment.date}</p>
          </div>
        </CardHeader>
        <CardContent>
          <p>{comment.content}</p>
        </CardContent>
        <CardFooter>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setReplyingTo(comment.id)}
          >
            <MessageSquare className="mr-2 h-4 w-4" />
            Reply
          </Button>
        </CardFooter>
        {replyingTo === comment.id && (
          <CardContent>
            <Textarea
              placeholder="Write a reply..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="mb-2"
            />
            <Button onClick={() => handleSubmitComment(comment.id)}>
              Post Reply
            </Button>
          </CardContent>
        )}
        {comment.replies.length > 0 && renderComments(comment.replies, true)}
      </Card>
    ));
  };

  return (
    <div className="mx-auto max-w-2xl p-4">
      <h2 className="mb-4 text-2xl font-semibold">Comments</h2>
      {renderComments(comments)}


      <Card className="mt-8">
        <SignedOut>
          <CardTitle>Sign in to leave a comment</CardTitle>
          <CardContent>
            <SignInButton />
          </CardContent>
        </SignedOut>
        <SignedIn>
        <CardHeader>
          <CardTitle>Leave a Comment</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="Write your comment here..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="mb-2"
          />
          <Button onClick={() => handleSubmitComment()}>Post Comment</Button>
        </CardContent>
        </SignedIn>
      </Card>

    </div>
  );
}
