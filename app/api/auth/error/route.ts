import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
  const error = req.nextUrl.searchParams.get('error');

  let errorMessage = '';
  if (error === 'CredentialsSignin') {
    errorMessage = '아이디 또는 비밀번호가 잘못되었습니다. 다시 확인해 주세요.';
  } else if (error === 'OAuthSignin') {
    errorMessage = '소셜 로그인에 실패했습니다. 다른 계정으로 시도해 보세요.';
  } else {
    errorMessage = '알 수 없는 오류로 로그인에 실패했습니다. 다시 시도해 주세요.';
  }

  return NextResponse.redirect(`${req.nextUrl.origin}/auth/login?error=${errorMessage}`);
}