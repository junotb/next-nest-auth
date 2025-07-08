import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString, Min, MinLength } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({ example: 1, description: "사용자 인덱스" })
  @IsInt({ message: "사용자 인덱스는 정수여야 합니다." })
  @Min(1, { message: '사용자 인덱스는 1 이상이어야 합니다.' })
  idx: number;

  @ApiProperty({ example: "홍길동", description: "사용자 닉네임" })
  @IsString({ message: "닉네임은 문자열이어야 합니다." })
  @MinLength(2, { message: '닉네임은 최소 2자 이상이어야 합니다.' })
  nickname: string;

  constructor(partial: Partial<UpdateUserDto>) {
    Object.assign(this, partial);
  }
}
