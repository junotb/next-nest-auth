import { cookies } from "next/headers";
import { NextResponse } from "next/server";

// 사용자 세션 정보를 가져오는 함수
async function getSession(req: Request) {
  // 실제 애플리케이션에서는 세션 관리 솔루션을 사용하여 세션 정보를 가져와야 합니다.
  const cookieStore = cookies();
  const token = cookieStore.get('authToken')?.value;

  return token;
}

export async function middleware(req: Request) {
  const session = await getSession(req);

  // 사용자가 인증되지 않은 경우 로그인 페이지로 리다이렉트
  if (!session) {
    return NextResponse.redirect(new URL('/login', req.url));
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