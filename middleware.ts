import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';

export async function middleware(req: NextRequest) {
  const token = await getToken({ req });

  if (!token) {
    // 사용자가 인증되지 않은 경우 로그인 페이지로 리다이렉트
    return NextResponse.redirect(`${req.nextUrl.origin}/login`);
  }
	
  // 로그인 상태면 원래 요청한 경로로 이동한다.
  return NextResponse.next();
}

// matcher에 매칭되는 경로로 접근하는 경우, middleware 실행
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - login (login folder)
     * - images (public/images folder)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|login|images).*)',
  ],
};