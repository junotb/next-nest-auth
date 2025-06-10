export class RefreshResponseDto {
  message: string;
  accessToken: string;
  refreshToken: string;

  constructor(partial: Partial<RefreshResponseDto>) {
    Object.assign(this, partial);
  }
}