import { IsNotEmpty, IsNumberString, Length } from 'class-validator';

export class UpdatePhoneUserValidation {
  @IsNotEmpty({ message: 'Phone harus diisi' })
  @IsNumberString()
  @Length(10, 15)
  phone: string;
}
