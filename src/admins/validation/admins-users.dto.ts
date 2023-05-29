import { Type } from 'class-transformer';
import {
  IsArray,
  IsEmail,
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsNumberString,
  IsOptional,
  IsString,
  IsUUID,
  Length,
  ValidateIf,
} from 'class-validator';
import { AdminStatus } from 'src/database/entities/admins.entity';

export class CreateAdminUserDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsString()
  @ValidateIf((o) => o.email !== '')
  @IsEmail()
  email: string;

  @IsNumberString()
  @Length(10, 15)
  phone: string;

  @IsOptional()
  nip: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  @IsUUID('all', { message: 'Role ID bukan format UUID' })
  role_id: string;
}
export class UpdateAdminUserDto {
  @IsOptional()
  @ValidateIf((o) => o.id !== '')
  @IsUUID('all', { message: 'ID bukan format UUID' })
  id: string;

  @IsOptional()
  @ValidateIf((o) => o.name !== '')
  @IsString()
  name: string;

  @IsOptional()
  @ValidateIf((o) => o.email !== '')
  @IsEmail()
  email: string;

  @IsOptional()
  @ValidateIf((o) => o.phone !== '')
  @IsString()
  phone: string;

  @IsOptional()
  @ValidateIf((o) => o.password !== '')
  @IsString()
  password: string;

  @IsOptional()
  nip: string;

  @IsOptional()
  @ValidateIf((o) => o.role_id !== '')
  @IsUUID('all', { message: 'Role ID bukan format UUID' })
  role_id: string;
}

export class UpdateEmailDto {
  @IsString()
  @IsOptional()
  id: string;

  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  @IsOptional()
  otp_code: string;
}

export class UpdatePhoneDto {
  @IsString()
  @IsOptional()
  id: string;

  @IsString()
  phone: string;

  @IsString()
  @IsOptional()
  otp_code: string;
}

export class OtpDto {
  @IsString()
  @IsOptional()
  id: string;
  @IsString()
  @IsOptional()
  name: string;
  @IsString()
  @IsOptional()
  id_otp: string;
  @IsString()
  @IsEmail()
  @IsOptional()
  email: string;
  @IsString()
  @IsOptional()
  phone: string;
  @IsString()
  @IsOptional()
  referral_code: string;
  @IsString()
  @IsOptional()
  otp_code: string;
  @IsString()
  @IsOptional()
  user_type: string;
  @IsString()
  @IsOptional()
  validated: string;
}

export class AdminUserIdDto {
  user_id: string;
}
export class BaseQueryFilterDto {
  @IsOptional()
  search: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'Limit bukan format number' })
  limit: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'Limit bukan format number' })
  page: number;
}

export class ListAdminUserDTO extends BaseQueryFilterDto {
  @IsOptional()
  @IsUUID()
  role_id: string;

  @IsOptional()
  @IsArray()
  @IsIn(Object.values(AdminStatus), { each: true })
  statuses: AdminStatus[];
}

export class UpdateProfileDto {
  @IsString()
  @IsOptional()
  id: string;

  @IsString()
  @IsOptional()
  name: string;

  @IsString()
  @IsOptional()
  nip: string;
}

export class UpdatePasswordDto {
  @IsString()
  @IsOptional()
  id: string;

  @IsString()
  @IsOptional()
  old_password: string;

  @IsString()
  @IsOptional()
  new_password: string;
}

export class UbahEmailDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;
}

export class VerifikasiUbahEmailDto {
  @IsNotEmpty()
  token: string;
}

export class VerifikasiUbahPhoneDto {
  @IsNotEmpty()
  token: string;

  @IsNotEmpty()
  password: string;
}

export class ResponseAdminDto {
  id?: string;

  name?: string;

  email?: string;

  token_reset_password: string;

  phone?: string;

  nip?: string;

  created_at?: Date;

  updated_at?: Date;

  deleted_at?: Date;

  email_verified_at?: Date;

  phone_verified_at?: Date;
}
