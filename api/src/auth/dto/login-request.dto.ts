import { ApiProperty } from "@nestjs/swagger";
import { IsEmail } from "class-validator";

export class LoginRequestDto {
  @ApiProperty({ example: "user123@email.com", description: "사용자 아이디" })
  @IsEmail({}, { message: "유효한 이메일 형식이 아닙니다." })
  id: string;

  @ApiProperty({ example: "password123", description: "사용자 비밀번호" })
  pwd: string;

  constructor(partial: Partial<LoginRequestDto>) {
    Object.assign(this, partial);
  }
}