import { ApiProperty } from "@nestjs/swagger";
import { IsInt, Min } from "class-validator";

export class DeleteUserDto {
  @ApiProperty({ example: 1, description: "사용자 인덱스" })
  @IsInt({ message: "사용자 인덱스는 정수여야 합니다." })
  @Min(1, { message: "사용자 인덱스는 1 이상이어야 합니다." })
  idx: number;

  constructor(partial: Partial<DeleteUserDto>) {
    Object.assign(this, partial);
  }
}