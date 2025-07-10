import { ApiProperty } from "@nestjs/swagger";
import { IsInt, Min } from "class-validator";

export class DeleteSocialUserDto {
  @ApiProperty({ example: 1, description: "유저 인덱스" })
  @IsInt({ message: "유저 인덱스는 정수여야 합니다." })
  @Min(1, { message: "유저 인덱스는 1 이상이어야 합니다." })
  userIdx: number;
  
  constructor(partial: Partial<DeleteSocialUserDto>) {
    Object.assign(this, partial);
  }
}
