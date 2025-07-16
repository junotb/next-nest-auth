import { SafeUser } from "../../common/type/safe-user.type";

export class SignUpResponseDto {
  user: SafeUser;

  constructor(partial: Partial<SignUpResponseDto>) {
    Object.assign(this, partial);
  }
}