import { ApiProperty } from "@nestjs/swagger";
import { IsEmail } from "class-validator";

export class CreateUserDto {
  @IsEmail()
  @ApiProperty({ example: 'user123@email.com', description: '사용자 아이디' })
  id: string;

  @ApiProperty({ example: "password123", description: "사용자 비밀번호" })
  pwd: string;
  
  @ApiProperty({ example: "password123", description: "비밀번호 확인" })
  usePwd: number;

  @ApiProperty({ example: "홍길동", description: "사용자 이름" })
  name: string;

  @ApiProperty({ example: "홍길동", description: "사용자 닉네임" })
  nickname: string;

  constructor(partial: Partial<CreateUserDto>) {
    Object.assign(this, partial);
  }
}
