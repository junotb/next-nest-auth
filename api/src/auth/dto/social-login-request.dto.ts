import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsIn, IsString } from "class-validator";

export type SocialProviderType = "naver" | "kakao" | "google";

export class SocialLoginRequestDto {
  @ApiProperty({ example: "naver", description: "소셜 로그인 제공자" })
  @IsIn(["naver", "kakao", "google"], { message: "지원하지 않는 소셜 로그인 제공자입니다." })
  provider: SocialProviderType;

  @ApiProperty({ example: "socialUser123", description: "소셜 사용자 ID" })
  @IsString({ message: "소셜 사용자 ID는 문자열이어야 합니다." })
  providerAccountId: string;

  @ApiProperty({ example: "user123@email.com", description: "사용자 아이디" })
  @IsEmail({}, { message: "유효한 이메일 형식이 아닙니다." })
  id: string;

  @ApiProperty({ example: "John Doe", description: "사용자 이름" })
  @IsString({ message: "사용자 이름은 문자열이어야 합니다." })
  name: string;

  @ApiProperty({ example: "johndoe", description: "사용자 닉네임" })
  @IsString({ message: "사용자 닉네임은 문자열이어야 합니다." })
  nickname: string;

  constructor(partial: Partial<SocialLoginRequestDto>) {
    Object.assign(this, partial);
  }
}