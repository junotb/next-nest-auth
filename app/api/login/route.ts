import { NextResponse } from 'next/server'
import { serialize } from 'cookie';

export async function POST(
  req: Request
) {
  // 사용자 자격 증명 확인
  const { username, password } = await req.json();
  
  if (username === 'username' && password === 'password') {
    // 사용자 인증을 위한 세션 쿠키 또는 토큰 설정
    const response = NextResponse.next();
    response.cookies.set('authToken', 'valid_token', {
      path: '/',
      httpOnly: true
    });
    
    return NextResponse.json({ message: '로그인 성공' }, { status: 200 });
  } else {
    return NextResponse.json({ error: '잘못된 사용자 이름 또는 비밀번호' }, { status: 401 });
  }
}