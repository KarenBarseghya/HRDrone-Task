import { IsUUID, IsNotEmpty } from 'class-validator';

export class DeleteRequestDto {
  @IsNotEmpty()
  @IsUUID()
  requestId: string;
}
