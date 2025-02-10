import { IsUUID, IsNotEmpty } from 'class-validator';

export class AcceptRequestDto {
  @IsNotEmpty()
  @IsUUID()
  requestId: string;
}
