export class SocialLoginResponseDto {
  accessToken: string;
  refreshToken: string;

  constructor(partial: Partial<SocialLoginResponseDto>) {
    Object.assign(this, partial);
  }
}