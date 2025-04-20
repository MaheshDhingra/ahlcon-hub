import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { useAuth } from '@clerk/nextjs';
import { clerkClient } from '@clerk/nextjs/server';

export async function GET() {
  try {
    const posts = await prisma.post.findMany({
      include: {
        author: {
          select: {
            username: true,
            email: true
          }
        },
        comments: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    return NextResponse.json(posts);
  } catch (error) {
    return NextResponse.json({ error: 'Error fetching posts' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { userId, sessionId, getToken, isLoaded, isSignedIn } = useAuth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const client = await clerkClient();
    const user = await client.users.getUser(userId);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const { title, content, type } = await request.json();

    // Validate required fields
    if (!title || !content || !type) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Create or update user in our database based on Clerk user
    const dbUser = await prisma.user.upsert({
      where: { id: userId },
      create: {
        id: userId,
        email: user.emailAddresses[0]?.emailAddress || '',
        username: user.username || `${user.firstName} ${user.lastName}`.trim()
      },
      update: {
        email: user.emailAddresses[0]?.emailAddress || '',
        username: user.username || `${user.firstName} ${user.lastName}`.trim()
      }
    });

    const post = await prisma.post.create({
      data: {
        title,
        content,
        type,
        authorId: dbUser.id,
        likes: 0
      },
      include: {
        author: {
          select: {
            username: true,
            email: true
          }
        }
      }
    });

    return NextResponse.json(post);
  } catch (error) {
    console.error('Error creating post:', error);
    return NextResponse.json({ error: 'Error creating post' }, { status: 500 });
  }
}