import { getUser } from '@/firebase';
import { headers } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(
  req: NextRequest
) {
  // 사용자 자격 증명 확인
  const { username, password } = await req.json();
  
  const data = await getUser(username, password);

  if (data) {
    // 사용자 인증을 위한 세션 쿠키 또는 토큰 설정
    const url = req.nextUrl.clone();
    url.pathname = '/';

    return NextResponse.json({ message: '로그인 성공' }, {
      status: 200,
      headers: {
        'Set-Cookie': `authToken=valid_token; Path=/; HttpOnly;`,
      }
    });
  } else {
    return NextResponse.json({ error: '잘못된 사용자 이름 또는 비밀번호' }, { status: 401 });
  }
}