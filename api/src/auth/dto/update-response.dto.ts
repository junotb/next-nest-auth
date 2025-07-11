import { SafeUser } from "src/common/type/safe-user.type";

export class UpdateResponseDto {
  user: SafeUser;

  constructor(partial: Partial<UpdateResponseDto>) {
    Object.assign(this, partial);
  }
}