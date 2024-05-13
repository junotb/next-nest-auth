import { getUser } from '@/firebase';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  // 사용자 자격 증명 확인
  const { username, password } = await req.json();
  
  try {
    const data = await getUser(username, password);
    if (!data) {
      throw new Error('잘못된 사용자 이름 또는 비밀번호');
    }

    const response = NextResponse.json({ message: '로그인 성공' });
    response.cookies.set('authToken', data.name!, { path: '/', httpOnly: true });
    return response;
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 401 });    
  }
}