import { prisma } from '@/lib/prisma';
import { NextResponse, NextRequest } from 'next/server';
import { useAuth } from '@clerk/nextjs';
import { use } from 'react';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Get authenticated user ID from Clerk
    const { userId, sessionId, getToken, isLoaded, isSignedIn } = useAuth()
    if (!isLoaded) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Extract comment content from request body
    const { content } = await request.json();

    // Validate required fields
    if (!content) {
      return NextResponse.json({ error: 'Comment content is required' }, { status: 400 });
    }

    // Create or update user in our database based on Clerk auth info
    const comment = await prisma.comment.create({
      data: {
        content,
        authorId: userId,
        postId: params.id
      },
      include: {
        author: {
          select: {
            username: true
          }
        }
      }
    });

    return NextResponse.json(comment);
  } catch (error) {
    console.error('Error creating comment:', error);
    return NextResponse.json({ error: 'Error creating comment' }, { status: 500 });
  }
}