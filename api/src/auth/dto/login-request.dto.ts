import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, Matches, MinLength } from "class-validator";

export class LoginRequestDto {
  @ApiProperty({ example: "user123@email.com", description: "사용자 아이디" })
  @IsNotEmpty({ message: "이메일 주소를 입력하세요." })
  @IsEmail({}, { message: "유효한 이메일 형식이 아닙니다." })
  id: string;

  @ApiProperty({ example: "password123", description: "사용자 비밀번호" })
  @IsNotEmpty({ message: "비밀번호를 입력하세요." })
  @MinLength(8, { message: "비밀번호는 8자 이상이어야 합니다." })
  @Matches(/[0-9]/, { message: "비밀번호는 숫자를 포함해야 합니다." })
  @Matches(/[a-zA-Z]/, { message: "비밀번호는 영문자를 포함해야 합니다." })
  @Matches(/[~!@#$%^&*()_+|<>?:{}]/, { message: "비밀번호는 특수문자를 포함해야 합니다." })
  pwd: string;

  constructor(partial: Partial<LoginRequestDto>) {
    Object.assign(this, partial);
  }
}