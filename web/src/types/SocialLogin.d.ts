// 소셜 플랫폼 타입
type SocialProviderType = "naver" | "kakao" | "google";

// 소셜 플랫폼 응답 타입
type SocialNaverResponse = {
  response: {
    id: string;
    email: string;
    name: string;
    nickname: string;
  };
};
type SocialKakaoResponse = {
  id: string;
  kakao_account: {
    email: string;
    profile: {
      nickname: string;
    };
  };
};
type SocialGoogleResponse = {
  sub: string;
  email: string;
  name: string;
};

// 소셜 사용자 정보 타입
type SocialUserInfo = {
  id: string;
  email: string;
  name: string;
  nickname: string;
};

// 소셜 플랫폼 설정 타입 //
type SocialProviderConfig<T> = {
  tokenUrl: string;
  infoUrl: string;
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  getUserInfo: (data: T) => SocialUserInfo;
};