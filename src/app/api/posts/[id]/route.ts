import type { NextApiRequest, NextApiResponse } from 'next';
import { auth } from '@clerk/nextjs/server';
import prisma from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).end();
  }

  try {
    const { userId: clerkUserId } = await auth();
    if (!clerkUserId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { id } = req.query;
    if (typeof id !== 'string') {
      return res.status(400).json({ error: 'Invalid id' });
    }

    // Verify user exists
    const user = await prisma.user.findUnique({
      where: { clerkUserId },
    });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check for an existing upvote
    const existingUpvote = await prisma.upvote.findUnique({
      where: {
        clerkUserId_postId: {
          clerkUserId,
          postId: id,
        },
      },
    });

    if (existingUpvote) {
      // Delete the upvote and decrement the count
      const [deletedUpvote, updatedPost] = await prisma.$transaction([
        prisma.upvote.delete({
          where: {
            clerkUserId_postId: {
              clerkUserId,
              postId: id,
            },
          },
        }),
        prisma.post.update({
          where: { id },
          data: { upvotes: { decrement: 1 } },
        }),
      ]);
      return res.status(200).json(updatedPost);
    } else {
      // Create the upvote and increment the count
      const [upvote, updatedPost] = await prisma.$transaction([
        prisma.upvote.create({
          data: {
            clerkUserId,
            postId: id,
          },
        }),
        prisma.post.update({
          where: { id },
          data: { upvotes: { increment: 1 } },
        }),
      ]);
      return res.status(200).json(updatedPost);
    }
  } catch (error) {
    console.error('[UPVOTE_ERROR]', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
