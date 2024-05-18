import { addCredentialsUser } from '@/firebase';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

interface SignupRequest {
  name: string;
  username: string;
  password: string;
}

export async function POST(req: NextRequest) {
  const { name, username, password }: SignupRequest = await req.json();

  // 필요 추가 요소
  // 아이디와 비밀번호 유효성 검사 규칙
  // 비밀번호 암호화 함수

  if (!name || !username || !password) {
    return NextResponse.json({ error: '이름, 아이디, 비밀번호를 입력해야 합니다.' }, { status: 400 });
  }

  try {
    const userId = await addCredentialsUser(name, username, password);
    return NextResponse.json({ userId }, { status: 201 });
  } catch (error) {
    console.error('사용자 추가 중 오류 발생:', error);
    return NextResponse.json({ error: '사용자 추가에 실패했습니다.' }, { status: 500 });
  }
}