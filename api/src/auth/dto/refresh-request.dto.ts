import { ApiProperty } from "@nestjs/swagger";

export class RefreshRequestDto {
  @ApiProperty({ example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...", description: "리프레시 토큰" })
  refreshToken: string;

  constructor(partial: Partial<RefreshRequestDto>) {
    Object.assign(this, partial);
  }
}
