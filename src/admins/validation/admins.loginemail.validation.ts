import { IsEmail, IsNotEmpty, IsOptional } from 'class-validator';

export class AdminLoginEmailValidation {
  @IsNotEmpty()
  password: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsOptional()
  lang: string;
}
