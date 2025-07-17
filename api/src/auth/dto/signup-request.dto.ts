import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsInt, IsNotEmpty, Matches, Max, MaxLength, Min, MinLength } from "class-validator";

export class SignUpRequestDto {
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

  @ApiProperty({ example: 1, description: "비밀번호 사용 여부 (1: 사용, 0: 사용 안함)" })
  @IsInt({ message: "비밀번호 사용 여부는 정수여야 합니다." })
  @Min(0, { message: "비밀번호 사용 여부는 0 또는 1이어야 합니다." })
  @Max(1, { message: "비밀번호 사용 여부는 0 또는 1이어야 합니다." })
  usePwd: number;

  @ApiProperty({ example: "홍길동", description: "사용자 이름" })
  @IsNotEmpty({ message: "이름을 입력하세요." })
  @MinLength(2, { message: "이름은 2자 이상이어야 합니다." })
  @MaxLength(10, { message: "이름은 10자 이하이어야 합니다." })
  @Matches(/^[a-zA-Z가-힣]+$/, { message: "이름은 한글, 영문자만 사용할 수 있습니다." })
  name: string;

  @ApiProperty({ example: "홍길동", description: "사용자 닉네임" })
  @IsNotEmpty({ message: "닉네임을 입력하세요." })
  @MinLength(2, { message: "닉네임은 2자 이상이어야 합니다." })
  @MaxLength(10, { message: "닉네임은 10자 이하이어야 합니다." })
  @Matches(/^[a-zA-Z0-9가-힣]+$/, { message: "닉네임은 한글, 영문자, 숫자만 사용할 수 있습니다." })
  nickname: string;

  constructor(partial: Partial<SignUpRequestDto>) {
    Object.assign(this, partial);
  }
}