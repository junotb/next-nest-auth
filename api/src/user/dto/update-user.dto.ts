import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiProperty({ example: 1, description: "사용자 인덱스" })
  idx: number;

  @ApiProperty({ example: "홍길동", description: "사용자 닉네임" })
  nickname: string;
}
