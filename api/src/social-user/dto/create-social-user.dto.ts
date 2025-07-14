import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsString, Min } from "class-validator";

export class CreateSocialUserDto {
  @ApiProperty({ example: 1, description: "유저 인덱스" })
  @IsInt({ message: "유저 인덱스는 정수여야 합니다." })
  @Min(1, { message: "유저 인덱스는 1 이상이어야 합니다." })
  userIdx: number;

  @ApiProperty({ example: "google", description: "소셜 로그인 제공자" })
  @IsString({ message: "소셜 로그인 제공자는 문자열이어야 합니다." })
  provider: string;

  @ApiProperty({ example: "1234567890", description: "소셜 로그인 제공자 계정 ID" })
  @IsString({ message: "소셜 로그인 제공자 계정 ID는 문자열이어야 합니다." })
  providerAccountId: string;
  
  constructor(partial: Partial<CreateSocialUserDto>) {
    Object.assign(this, partial);
  }
}
