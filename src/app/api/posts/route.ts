<<<<<<< HEAD
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
=======
import type { NextApiRequest, NextApiResponse } from 'next';
import { auth } from '@clerk/nextjs/server';
import prisma from '@/lib/prisma';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    try {
      const posts = await prisma.post.findMany({
        include: {
          user: true,
          upvotes: true,
        },
        orderBy: { createdAt: 'desc' },
      });

      return res.status(200).json(posts);
    } catch (error) {
      console.error('GET Error:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  } else if (req.method === 'POST') {
    try {
      const { userId: clerkUserId } = await auth();
      
      if (!clerkUserId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const { title, description } = req.body;

      // Validate required fields
      if (!title?.trim() || !description?.trim()) {
        return res.status(400).json({ error: 'Title and description are required' });
      }

      // Get or create user
      await prisma.user.upsert({
        where: { clerkUserId },
        create: {
          clerkUserId,
          email: '', // Add email handling if needed
          name: 'Anonymous',
        },
        update: {},
      });

      // Create post
      const post = await prisma.post.create({
        data: {
          title: title.trim(),
          description: description.trim(),
          userId: clerkUserId,
        },
      });

      return res.status(201).json(post);
    } catch (error) {
      console.error('POST Error:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }
}
>>>>>>> 77ba5867bee9535b28578cfcd2adef6ba3ba5882
