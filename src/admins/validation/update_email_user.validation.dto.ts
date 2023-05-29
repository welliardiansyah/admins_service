import { IsEmail, IsNotEmpty } from 'class-validator';

export class UpdateEmailUserValidation {
  @IsNotEmpty({ message: 'Email harus diisi' })
  @IsEmail()
  email: string;
}
