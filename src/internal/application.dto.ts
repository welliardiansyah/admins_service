import { IsNotEmpty, IsString } from 'class-validator';

export class ApplicationDTO {
  @IsString()
  @IsNotEmpty()
  users_id: string;

  @IsString()
  @IsNotEmpty()
  apps_id: string;
}
