import { IsNotEmpty, IsNumberString, Length } from 'class-validator';

export class OtpCreateValidation {
  @IsNotEmpty()
  @IsNumberString()
  @Length(10, 15)
  phone: string;

  referral_code: string;

  otp_code: string;
  user_type: string;
}
