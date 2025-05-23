<<<<<<< HEAD
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PlusCircle, Search } from "lucide-react";
import PostList from "@/components/PostList";
import { Input } from "@/components/ui/input";
import { ThemeToggle } from "@/components/ThemeToggle";
import { UserButton, SignInButton, useUser } from "@clerk/nextjs";
import { toast } from "sonner";

type PostType = "suggestion" | "discussion" | "complaint";

interface Post {
  id: string;
  title: string;
  content: string;
  type: PostType;
  createdAt: string;
  likes: number;
  author: {
    username: string;
  };
  comments: any[];
}

export default function Home() {
  const { user, isLoaded } = useUser();
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<"all" | PostType>("all");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch("/api/posts");
        if (!response.ok) {
          throw new Error("Failed to fetch posts");
        }
        const data = await response.json();

        const transformedPosts = data.map((post: any) => ({
          ...post,
          createdAt: new Date(post.createdAt).toISOString(),
        }));

        setPosts(transformedPosts);
      } catch (error) {
        console.error("Error fetching posts:", error);
        toast.error("Failed to load posts");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const filteredPosts = posts
    .filter(
      (post) =>
        searchQuery === "" ||
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.content.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .filter((post) => activeFilter === "all" || post.type === activeFilter);

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Ahlcon School Forum</h1>
          <div className="flex items-center gap-3">
            <ThemeToggle />
          </div>
        </div>
        <div className="text-center py-12">Loading posts...</div>
      </div>
    );
  }

  return (
    <main className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Ahlcon School Forum</h1>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          {isLoaded && (
            <>
              {user ? (
                <>
                  <Button asChild>
                    <Link href="/create">
                      <PlusCircle className="mr-2 h-4 w-4" /> New Post
                    </Link>
                  </Button>
                  <UserButton afterSignOutUrl="/" />
                </>
              ) : (
                <SignInButton mode="modal">
                  <Button>Sign In</Button>
                </SignInButton>
              )}
            </>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-4 mb-6">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search posts..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            variant={activeFilter === "all" ? "default" : "outline"}
            onClick={() => setActiveFilter("all")}
          >
            All
          </Button>
          <Button
            variant={activeFilter === "suggestion" ? "default" : "outline"}
            onClick={() => setActiveFilter("suggestion")}
          >
            Suggestions
          </Button>
          <Button
            variant={activeFilter === "discussion" ? "default" : "outline"}
            onClick={() => setActiveFilter("discussion")}
          >
            Discussions
          </Button>
          <Button
            variant={activeFilter === "complaint" ? "default" : "outline"}
            onClick={() => setActiveFilter("complaint")}
          >
            Complaints
          </Button>
        </div>
      </div>

      {filteredPosts.length === 0 && searchQuery && (
        <div className="flex flex-col items-center justify-center py-12">
          <p className="text-2xl font-semibold mb-2">No results found</p>
          <p className="text-muted-foreground">
            Try adjusting your search or filters
          </p>
        </div>
      )}

      <PostList posts={filteredPosts} />
    </main>
=======
import Link from 'next/link';
import prisma from '@/lib/prisma';
import CreatePostForm from '@/components/CreatePostForm';

async function getPosts() {
  return await prisma.post.findMany({
    include: {
      user: {
        select: {
          name: true,
          imageUrl: true
        }
      },
      upvotes: true
    },
    orderBy: {
      createdAt: 'desc'
    }
  });
}

export default async function Home() {
  const posts = await getPosts();

  return (
    <div className="max-w-4xl mx-auto p-4">
      <CreatePostForm />

      <h1 className="text-2xl font-bold mb-8">Recent Posts</h1>
      <div className="space-y-6">
        {posts.map(post => (
          <div key={post.id} className="border rounded-lg p-4 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <Link 
                href={`/posts/${post.id}`}
                className="hover:underline"
              >
                <h2 className="text-xl font-semibold">{post.title}</h2>
              </Link>
              <div className="flex items-center gap-2">
                <span className="text-gray-600">
                  {post.upvotes.length} upvotes
                </span>
              </div>
            </div>
            <p className="text-gray-700 mb-4 line-clamp-3">
              {post.description}
            </p>
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                {post.user.imageUrl && (
                  <img
                    src={post.user.imageUrl}
                    alt={post.user.name || 'User'}
                    className="w-6 h-6 rounded-full"
                  />
                )}
                <span className="text-gray-500">
                  {post.user.name}
                </span>
              </div>
              <Link
                href={`/posts/${post.id}`}
                className="text-blue-600 hover:underline"
              >
                View post →
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
>>>>>>> 77ba5867bee9535b28578cfcd2adef6ba3ba5882
  );
}