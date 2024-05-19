import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(req: NextRequest) {
  const token = await getToken({ req });
  console.log(token);

  if (!token) {
    // Redirect to the login page if the user is not authenticated
    return NextResponse.redirect(`${req.nextUrl.origin}/auth/login`);
  }
	
  // If authenticated, proceed to the originally requested path
  return NextResponse.next();
}

// Execute the middleware if the path matches the matcher
export const config = {
  matcher: [
    /*
      * Match all request paths except for:
      * - API routes (/api/...)
      * - Static files (/_next/static/...)
      * - Image optimization files (/_next/image/...)
      * - Favicon file (/favicon.ico)
      * - Authentication pages (/auth)
      * - Public images (/images/...)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|auth|images).*)',
  ],
};