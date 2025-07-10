import { NextRequest, NextResponse } from "next/server";

type SocialProviderConfig = {
  authUrl: string;
  clientId: string;
  redirectUri: string;
  scope?: string;
}

// 소셜 플랫폼별 설정
const socialProviderConfig: Record<SocialProviderType, SocialProviderConfig> = {
  naver: {
    authUrl: process.env.NAVER_AUTH_URL ?? "",
    clientId: process.env.NAVER_CLIENT_ID ?? "",
    redirectUri: process.env.NAVER_REDIRECT_URI ?? "",
  },
  kakao: {
    authUrl: process.env.KAKAO_AUTH_URL ?? "",
    clientId: process.env.KAKAO_CLIENT_ID ?? "",
    redirectUri: process.env.KAKAO_REDIRECT_URI ?? "",
  },
  google: {
    authUrl: process.env.GOOGLE_AUTH_URL ?? "",
    clientId: process.env.GOOGLE_CLIENT_ID ?? "",
    redirectUri: process.env.GOOGLE_REDIRECT_URI ?? "",
    scope: "openid email profile",
  },
};

// 소셜 플랫폼 타입
type SocialProviderType = "naver" | "kakao" | "google";

interface SocialProviderParams {
  params: {
    provider: SocialProviderType;
  };
};

// state 값을 동적으로 생성하는 함수
function generateState(): string {
  return Math.random().toString(36).substring(2) + Date.now();
}

export async function GET(_request: NextRequest, { params }: SocialProviderParams) {
  const { provider } = params;
  const { authUrl, clientId, redirectUri, scope } = socialProviderConfig[provider];
  const state = generateState();

  const redirectUrl = new URL(authUrl);
  redirectUrl.searchParams.set("response_type", "code");
  redirectUrl.searchParams.set("client_id", clientId);
  redirectUrl.searchParams.set("redirect_uri", redirectUri);
  redirectUrl.searchParams.set("state", state);
  if (scope) {
    redirectUrl.searchParams.set("scope", scope);
  }

  return NextResponse.redirect(redirectUrl.toString());
}