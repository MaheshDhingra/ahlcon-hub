import type { NextApiRequest, NextApiResponse } from 'next';
import { auth } from '@clerk/nextjs/server';
import prisma from '@/lib/prisma';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;

  switch (req.method) {
    case 'POST': {
      try {
        const { userId: clerkUserId } = await auth();
        if (!clerkUserId) {
          return res.status(401).json({ error: 'Unauthorized' });
        }

        const { content, parentId } = req.body;

        if (!content) {
          return res.status(400).json({ error: 'Content is required' });
        }

        // Validate parentId exists if provided
        if (parentId) {
          const parentExists = await prisma.comment.findUnique({
            where: { id: parentId },
          });
          if (!parentExists) {
            return res
              .status(404)
              .json({ error: 'Parent comment not found' });
          }
        }

        const comment = await prisma.comment.create({
          data: {
            content,
            postId: Array.isArray(id) ? id[0] : id,
            userId: clerkUserId,
            parentId: parentId || undefined, // Use undefined instead of null
          },
          include: {
            user: true,
            replies: true,
          },
        });

        return res.status(201).json(comment);
      } catch (error) {
        console.error('[COMMENTS_POST]', error);
        return res
          .status(500)
          .json({ error: 'Internal Server Error' });
      }
    }

    case 'GET': {
      try {
        const comments = await prisma.comment.findMany({
          where: {
            postId: Array.isArray(id) ? id[0] : id,
            parentId: null,
          },
          include: {
            user: true,
            replies: {
              include: {
                user: true,
                replies: true,
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
        });
        return res.status(200).json(comments);
      } catch (error) {
        console.error('[COMMENTS_GET]', error);
        return res
          .status(500)
          .json({ error: 'Internal Server Error' });
      }
    }

    default:
      res.setHeader('Allow', ['GET', 'POST']);
      return res
        .status(405)
        .json({ error: `Method ${req.method} Not Allowed` });
  }
}