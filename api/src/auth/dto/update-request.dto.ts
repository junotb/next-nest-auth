import { ApiProperty } from '@nestjs/swagger';

export class UpdateRequestDto {
  @ApiProperty({ example: "홍길동", description: "사용자 닉네임" })
  nickname: string;

  constructor(partial: Partial<UpdateRequestDto>) {
    Object.assign(this, partial);
  }
}
