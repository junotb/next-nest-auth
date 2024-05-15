import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
  const error = req.nextUrl.searchParams.get('error');

  if (error === 'CredentialsSignin') {
    return NextResponse.redirect(`${req.nextUrl.origin}/auth/login?error=${error}`);
  } else if (error === 'OAuthSignin') {
    return NextResponse.redirect(`${req.nextUrl.origin}/auth/login?error=${error}`);
  } else {
    return NextResponse.redirect(`${req.nextUrl.origin}/auth/login?error=${error}`);
  }
}