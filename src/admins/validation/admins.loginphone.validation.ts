import { IsNotEmpty, IsOptional, Length } from 'class-validator';

export class AdminLoginPhoneValidation {
  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  @Length(10, 15)
  phone: string;

  @IsOptional()
  lang: string;
}
