import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsInt, Max, Min } from "class-validator";

export class SignUpRequestDto {
  @IsEmail()
  @ApiProperty({ example: 'user123@email.com', description: '사용자 아이디' })
  id: string;

  @ApiProperty({ example: "password123", description: "사용자 비밀번호" })
  pwd: string;

  @ApiProperty({ example: 1, description: "비밀번호 사용 여부 (1: 사용, 0: 사용 안함)" })
  @IsInt()
  @Min(0)
  @Max(1)
  usePwd: number;

  @ApiProperty({ example: "홍길동", description: "사용자 이름" })
  name: string;

  @ApiProperty({ example: "홍길동", description: "사용자 닉네임" })
  nickname: string;

  constructor(partial: Partial<SignUpRequestDto>) {
    Object.assign(this, partial);
  }
}