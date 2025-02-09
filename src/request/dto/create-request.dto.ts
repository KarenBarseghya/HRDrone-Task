import { IsNotEmpty, IsUUID } from 'class-validator';

export class CreateRequestDto {
  @IsNotEmpty()
  @IsUUID()
  getterId: string;

  @IsNotEmpty()
  @IsUUID()
  senderId: string;
}
