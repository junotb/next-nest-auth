export class LoginResponseDto {
  message: string;
  accessToken: string;
  refreshToken: string;

  constructor(partial: Partial<LoginResponseDto>) {
    Object.assign(this, partial);
  }
}