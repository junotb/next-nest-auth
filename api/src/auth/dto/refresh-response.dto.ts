export class RefreshResponseDto {
  accessToken: string;
  refreshToken: string;

  constructor(partial: Partial<RefreshResponseDto>) {
    Object.assign(this, partial);
  }
}