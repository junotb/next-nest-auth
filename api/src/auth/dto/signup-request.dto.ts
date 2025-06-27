import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsInt, Max, Min } from "class-validator";

export class SignUpRequestDto {
  @ApiProperty({ example: "user123@email.com", description: "사용자 아이디" })
  @IsEmail({}, { message: "유효한 이메일 형식이 아닙니다." })
  id: string;

  @ApiProperty({ example: "password123", description: "사용자 비밀번호" })
  pwd: string;

  @ApiProperty({ example: 1, description: "비밀번호 사용 여부 (1: 사용, 0: 사용 안함)" })
  @IsInt({ message: "비밀번호 사용 여부는 정수여야 합니다." })
  @Min(0, { message: "비밀번호 사용 여부는 0 또는 1이어야 합니다." })
  @Max(1, { message: "비밀번호 사용 여부는 0 또는 1이어야 합니다." })
  usePwd: number;

  @ApiProperty({ example: "홍길동", description: "사용자 이름" })
  name: string;

  @ApiProperty({ example: "홍길동", description: "사용자 닉네임" })
  nickname: string;

  constructor(partial: Partial<SignUpRequestDto>) {
    Object.assign(this, partial);
  }
}