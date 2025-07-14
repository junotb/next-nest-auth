import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { useAuthStore } from '@/stores/useAuthStore';

// 소셜 플랫폼 별 설정
const socialProviderConfig = {
  naver: {
    tokenUrl: process.env.NAVER_TOKEN_URL ?? "",
    infoUrl: process.env.NAVER_INFO_URL ?? "",
    clientId: process.env.NAVER_CLIENT_ID ?? "",
    clientSecret: process.env.NAVER_CLIENT_SECRET ?? "",
    redirectUri: process.env.NAVER_REDIRECT_URI ?? "",
    getUserInfo: (data: SocialNaverResponse) => ({
      id: data.response.id,
      email: data.response.email,
      name: data.response.name,
      nickname: data.response.nickname,
    }),
  } satisfies SocialProviderConfig<SocialNaverResponse>,
  kakao: {
    tokenUrl: process.env.KAKAO_TOKEN_URL ?? "",
    infoUrl: process.env.KAKAO_INFO_URL ?? "",
    clientId: process.env.KAKAO_CLIENT_ID ?? "",
    clientSecret: process.env.KAKAO_CLIENT_SECRET ?? "",
    redirectUri: process.env.KAKAO_REDIRECT_URI ?? "",
    getUserInfo: (data: SocialKakaoResponse) => ({
      id: data.id,
      email: data.kakao_account.email,
      name: data.kakao_account.profile.nickname,
      nickname: data.kakao_account.profile.nickname,
    }),
  } satisfies SocialProviderConfig<SocialKakaoResponse>,
  google: {
    tokenUrl: process.env.GOOGLE_TOKEN_URL ?? "",
    infoUrl: process.env.GOOGLE_INFO_URL ?? "",
    clientId: process.env.GOOGLE_CLIENT_ID ?? "",
    clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    redirectUri: process.env.GOOGLE_REDIRECT_URI ?? "",
    getUserInfo: (data: SocialGoogleResponse) => ({
      id: data.sub,
      email: data.email,
      name: data.name,
      nickname: "", // 구글은 닉네임 제공 안함
    }),
  } satisfies SocialProviderConfig<SocialGoogleResponse>,
};

interface SocialProviderParams {
  params: {
    provider: SocialProviderType;
  };
};

export async function GET(request: NextRequest, { params }: SocialProviderParams) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get("code");
  const state = searchParams.get("state");

  const { provider } = params;
  const { tokenUrl, infoUrl, clientId, clientSecret, redirectUri, getUserInfo } = socialProviderConfig[provider];

  const tokenResponse = await axios({
    url: tokenUrl,
    method: provider === 'google' ? 'POST' : 'GET',
    [provider === 'google' ? 'data' : 'params']: {
      grant_type: 'authorization_code',
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
      code,
      state,
    },
  });

  const providerToken = tokenResponse.data.access_token;

  const infoResponse = await axios.get(infoUrl, {
    headers: {
      Authorization: `Bearer ${providerToken}`,
    },
  });

  const { id: providerAccountId, email: id, name, nickname } = getUserInfo(infoResponse.data);

  const response = await fetch('http://localhost:3001/auth/login/social', {
    method: 'POST',
    credentials: 'include', // withCredentials 대응
    headers: {
      'Content-Type': 'application/json',
      ...(useAuthStore.getState().accessToken && {
        Authorization: `Bearer ${useAuthStore.getState().accessToken}`,
      }),
    },
    body: JSON.stringify({
      provider,
      providerAccountId,
      id,
      name,
      nickname,
    }),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();

  return NextResponse.json({ accessToken: data.accessToken });
};