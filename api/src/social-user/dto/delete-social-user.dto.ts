import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class DeleteSocialUserDto {
  @ApiProperty({ example: "google", description: "소셜 로그인 제공자" })
  @IsString({ message: "소셜 로그인 제공자는 문자열이어야 합니다." })
  provider: string;

  @ApiProperty({ example: "1234567890", description: "소셜 로그인 제공자 계정 ID" })
  @IsString({ message: "소셜 로그인 제공자 계정 ID는 문자열이어야 합니다." })
  providerAccountId: string;
  
  constructor(partial: Partial<DeleteSocialUserDto>) {
    Object.assign(this, partial);
  }
}
