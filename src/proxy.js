import { clerkMiddleware, createClerkClient } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

const ALLOWED_ADMIN_EMAIL = 'veryv1656@gmail.com';

const clerkClient = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY,
});

export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth();
  const { pathname } = req.nextUrl;

  const isDashboardRoute = pathname.startsWith('/dashboard');

  if (!isDashboardRoute) {
    return NextResponse.next();
  }

  if (!userId) {
    const signInUrl = new URL('/login', req.url);
    signInUrl.searchParams.set('redirect_url', pathname);
    return NextResponse.redirect(signInUrl);
  }

  if (userId) {
    try {
      const user = await clerkClient.users.getUser(userId);
      const primaryEmail = user.emailAddresses?.find(
        (e) => e.id === user.primaryEmailAddressId
      )?.emailAddress;

      if (primaryEmail !== ALLOWED_ADMIN_EMAIL) {
        await clerkClient.users.deleteUser(userId);
        return NextResponse.redirect(new URL('/unauthorized', req.url));
      }
    } catch {
      return NextResponse.redirect(new URL('/unauthorized', req.url));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/__clerk/:path*',
    '/(api|trpc)(.*)',
  ],
};