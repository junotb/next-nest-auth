import { ApiProperty } from "@nestjs/swagger";

export class DeleteUserDto {
  @ApiProperty({ example: 1, description: "사용자 인덱스" })
  idx: number;

  constructor(partial: Partial<DeleteUserDto>) {
    Object.assign(this, partial);
  }
}