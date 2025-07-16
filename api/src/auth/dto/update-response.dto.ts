import { SafeUser } from "../../common/type/safe-user.type";

export class UpdateResponseDto {
  user: SafeUser;

  constructor(partial: Partial<UpdateResponseDto>) {
    Object.assign(this, partial);
  }
}