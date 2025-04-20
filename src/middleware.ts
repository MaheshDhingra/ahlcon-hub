<<<<<<< HEAD
import { clerkMiddleware } from "@clerk/nextjs/server";

export default clerkMiddleware();

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
=======
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

const isProtectedRoute = createRouteMatcher([
  "/posts(.*)",
  "/api/posts(.*)"
]);

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    const { userId: clerkUserId } = auth();
    
    if (clerkUserId) {
      // Sync user with database
      await prisma.user.upsert({
        where: { clerkUserId },
        create: {
          clerkUserId,
          email: "", // Update with Clerk data if available
          name: "Anonymous",
        },
        update: {},
      });
    }
  }
  
  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
>>>>>>> 77ba5867bee9535b28578cfcd2adef6ba3ba5882
};