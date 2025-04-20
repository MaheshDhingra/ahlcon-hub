"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageSquare, ThumbsUp, Calendar } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";

type Post = {
  id: string;
  title: string;
  content: string;
  type: "suggestion" | "discussion" | "complaint";
  author: string;
  createdAt: Date;
  likes: number;
  comments: number;
};

interface PostListProps {
  posts: Post[];
}

export default function PostList({ posts }: PostListProps) {
  // Function to get the badge color based on post type
  const getBadgeVariant = (type: Post["type"]) => {
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

  // Function to get avatar fallback from name (first letters)
  const getAvatarFallback = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase();
  };

  if (posts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <p className="text-2xl font-semibold mb-2">No posts found</p>
        <p className="text-muted-foreground">
          Be the first to create a post in this category!
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {posts.map((post) => (
        <Link href={`/post/${post.id}`} key={post.id} className="block">
          <Card className="overflow-hidden hover:shadow-md transition-shadow h-full cursor-pointer">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <Badge
                  variant={getBadgeVariant(post.type) as any}
                  className="mb-2"
                >
                  {post.type.charAt(0).toUpperCase() + post.type.slice(1)}
                </Badge>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Calendar className="h-3.5 w-3.5 mr-1" />
                  {formatDistanceToNow(post.createdAt, { addSuffix: true })}
                </div>
              </div>
              <CardTitle className="line-clamp-2">{post.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground line-clamp-3">
                {post.content}
              </p>
            </CardContent>
            <CardFooter className="flex justify-between pt-3 border-t">
              <div className="flex items-center">
                <Avatar className="h-6 w-6 mr-2">
                  <AvatarFallback>
                    {getAvatarFallback(post.author)}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm">{post.author}</span>
              </div>
              <div className="flex gap-3">
                <div className="flex items-center text-sm gap-1 text-muted-foreground">
                  <ThumbsUp className="h-4 w-4" />
                  {post.likes}
                </div>
                <div className="flex items-center text-sm gap-1 text-muted-foreground">
                  <MessageSquare className="h-4 w-4" />
                  {post.comments}
                </div>
              </div>
            </CardFooter>
          </Card>
        </Link>
      ))}
    </div>
  );
}
