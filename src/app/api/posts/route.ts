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
