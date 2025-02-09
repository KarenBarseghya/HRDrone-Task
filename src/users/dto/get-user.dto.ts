import { IsNumber, IsOptional, IsString } from 'class-validator';

export class GetUsersDto {
  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  surname: string;

  @IsOptional()
  @IsNumber()
  minAge: number;

  @IsOptional()
  @IsNumber()
  maxAge: number;
}
