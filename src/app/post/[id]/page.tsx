"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ArrowLeft, ThumbsUp, MessageSquare, Calendar } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { ThemeToggle } from "@/components/ThemeToggle";

// Temporary mock data (would come from database in real app)
const MOCK_POSTS = [
  {
    id: "1",
    title: "Improve cafeteria food options",
    content:
      "We need more vegetarian options in the cafeteria. Currently, there are only 1-2 vegetarian dishes available each day, and they're often not very nutritious or filling. Many students who don't eat meat are left with few choices. I propose adding at least one more vegetarian main dish and ensuring that all vegetarian options are protein-rich and nutritionally balanced.",
    type: "suggestion",
    author: "Sarah Johnson",
    createdAt: new Date("2023-11-10"),
    likes: 15,
    comments: [
      {
        id: "1",
        author: "Michael Chen",
        content:
          "I completely agree. As a vegetarian, I often end up just eating the sides.",
        createdAt: new Date("2023-11-10"),
      },
      {
        id: "2",
        author: "Jessica Williams",
        content:
          "It would be great to see some more international vegetarian options too!",
        createdAt: new Date("2023-11-11"),
      },
    ],
  },
  {
    id: "2",
    title: "School WiFi issues",
    content:
      "The WiFi in the library is unreliable during peak hours. Can we get this fixed? It's becoming a serious issue for students trying to complete research or assignments during free periods. The connection drops frequently, and the speed is very slow when many people are using it.",
    type: "complaint",
    author: "Michael Chen",
    createdAt: new Date("2023-11-08"),
    likes: 32,
    comments: [
      {
        id: "1",
        author: "David Kim",
        content:
          "This has been a problem for months. I hope they address it soon.",
        createdAt: new Date("2023-11-09"),
      },
    ],
  },
  {
    id: "3",
    title: "Should we have a winter formal?",
    content:
      "I think we should organize a winter formal dance in December. What do others think? It would be a great way to celebrate the end of the semester and give everyone something to look forward to during finals. We could decorate the gym with a winter theme, have a DJ, and maybe even do a fundraiser alongside it.",
    type: "discussion",
    author: "Alex Rivera",
    createdAt: new Date("2023-11-05"),
    likes: 24,
    comments: [
      {
        id: "1",
        author: "Emily Johnson",
        content: "I love this idea! We could have a 'Winter Wonderland' theme.",
        createdAt: new Date("2023-11-06"),
      },
      {
        id: "2",
        author: "Jason Park",
        content: "I'd definitely attend! Can we form a committee to plan this?",
        createdAt: new Date("2023-11-07"),
      },
      {
        id: "3",
        author: "Sarah Johnson",
        content: "This would be a great tradition to start. I'm in!",
        createdAt: new Date("2023-11-08"),
      },
    ],
  },
];

export default function PostDetail() {
  const params = useParams();
  const router = useRouter();
  const postId = params.id as string;
  const [commentText, setCommentText] = useState("");

  // Find the post with the matching ID
  const post = MOCK_POSTS.find((p) => p.id === postId);

  if (!post) {
    return (
      <div className="container mx-auto py-8 px-4 text-center">
        <h1 className="text-2xl mb-4">Post not found</h1>
        <Button asChild>
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Forum
          </Link>
        </Button>
      </div>
    );
  }

  const getAvatarFallback = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase();
  };

  const getBadgeVariant = (type: string) => {
    switch (type) {
      case "suggestion":
        return "success";
      case "discussion":
        return "info";
      case "complaint":
        return "destructive";
      default:
        return "secondary";
    }
  };

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    // In a real app, you would send this to your backend
    // For now, we're just showing how it would work
    alert("In a real app, your comment would be posted!");
    setCommentText("");
  };

  return (
    <main className="container mx-auto py-8 px-4 max-w-3xl">
      <div className="flex justify-between items-center mb-6">
        <Button variant="ghost" asChild>
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Forum
          </Link>
        </Button>
        <ThemeToggle />
      </div>

      <Card className="mb-8">
        <CardHeader>
          <div className="flex items-center justify-between mb-2">
            <Badge variant={getBadgeVariant(post.type) as any}>
              {post.type.charAt(0).toUpperCase() + post.type.slice(1)}
            </Badge>
            <div className="flex items-center text-sm text-muted-foreground">
              <Calendar className="h-3.5 w-3.5 mr-1" />
              {formatDistanceToNow(post.createdAt, { addSuffix: true })}
            </div>
          </div>
          <CardTitle className="text-2xl">{post.title}</CardTitle>
          <CardDescription className="flex items-center mt-2">
            <Avatar className="h-6 w-6 mr-2">
              <AvatarFallback>{getAvatarFallback(post.author)}</AvatarFallback>
            </Avatar>
            Posted by {post.author}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="whitespace-pre-line">{post.content}</p>
        </CardContent>
        <CardFooter className="flex justify-end gap-3 border-t pt-4">
          <Button variant="outline" size="sm" className="gap-1">
            <ThumbsUp className="h-4 w-4" /> {post.likes}
          </Button>
          <Button variant="outline" size="sm" className="gap-1">
            <MessageSquare className="h-4 w-4" /> {post.comments.length}
          </Button>
        </CardFooter>
      </Card>

      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4">Comments</h2>

        <form onSubmit={handleSubmitComment} className="mb-6">
          <Textarea
            placeholder="Add a comment..."
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            className="mb-2"
          />
          <div className="flex justify-end">
            <Button type="submit">Post Comment</Button>
          </div>
        </form>

        {post.comments.length === 0 ? (
          <p className="text-center text-muted-foreground py-4">
            No comments yet. Be the first to comment!
          </p>
        ) : (
          <div className="space-y-4">
            {post.comments.map((comment) => (
              <Card key={comment.id}>
                <CardHeader className="py-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Avatar className="h-6 w-6 mr-2">
                        <AvatarFallback>
                          {getAvatarFallback(comment.author)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{comment.author}</span>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {formatDistanceToNow(comment.createdAt, {
                        addSuffix: true,
                      })}
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="py-2">
                  <p>{comment.content}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
