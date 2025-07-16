import { SafeUser } from "../../common/type/safe-user.type";

export class DeleteResponseDto {
  user: SafeUser;

  constructor(partial: Partial<DeleteResponseDto>) {
    Object.assign(this, partial);
  }
}