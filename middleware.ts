import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
	// 요청 헤더에서 로그인 여부를 확인할 수 있도록 쿠키에 접근
  const jwt = request.cookies.get('jwt');
	
	// 로그인 상태가 아니면 Redirection
  if (!jwt) {
    return NextResponse.redirect(new URL('/login', request.url));
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
     */
    '/((?!api|_next/static|_next/image|favicon.ico|login).*)',
  ],
};