export class UpdateResponseDto {
  message: string;

  constructor(partial: Partial<UpdateResponseDto>) {
    Object.assign(this, partial);
  }
}