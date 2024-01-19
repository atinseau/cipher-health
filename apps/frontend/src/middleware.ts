// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest, NextFetchEvent } from "next/server";
import { createEdgeRouter } from "next-connect";

const router = createEdgeRouter<NextRequest, NextFetchEvent>();

const withAuth = async (request: NextRequest, event: NextFetchEvent, next: () => Promise<NextResponse>) => {
  const accessToken = request.cookies.get('accessToken')
  const refreshToken = request.cookies.get('refreshToken')
  if (!accessToken || !refreshToken) {
    return NextResponse.redirect(new URL("/signin", request.url))
  }
  return next()
}

const withoutAuth = async (request: NextRequest, event: NextFetchEvent, next: () => Promise<NextResponse>) => {
  const accessToken = request.cookies.get('accessToken')
  const refreshToken = request.cookies.get('refreshToken')
  if (accessToken && refreshToken) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }
  return next()

}

// If user is not authenticated, redirect to signin if they try to access dashboard
router.get('/dashboard', withAuth)

// If user is authenticated, redirect to dashboard if they try to access signup or signin
router.get('/signup', withoutAuth)
router.get('/signin', withoutAuth)

router.all(() => {
  // default if none of the above matches
  return NextResponse.next();
});

export function middleware(request: NextRequest, event: NextFetchEvent) {
  return router.run(request, event);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};