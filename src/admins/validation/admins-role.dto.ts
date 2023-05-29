import {
  IsArray,
  IsEnum,
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

// Platform enum value from auth-role service
export enum Platform {
  NONE = 'NONE',
  SUPERADMIN = 'SUPERADMIN',
  STORES = 'STORES',
  CUSTOMER = 'CUSTOMER',
}

export class BaseAdminsRolesDto {
  @IsOptional()
  id?: string;
}
export class ParamIdDto {
  id: string;
}

export class BaseModulePermissionDto {
  module_id: string;
  permissions: string[];
}

export class AdminsRolesDto extends BaseAdminsRolesDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  status: string;

  @IsString()
  @IsNotEmpty()
  @IsEnum(Platform, {
    message: `Acceptable ENUM is : ['${Platform.SUPERADMIN}', '${Platform.STORES}', '${Platform.CUSTOMER}']`,
  })
  platform: string;

  @IsNotEmpty()
  @IsArray()
  module_permissions: BaseModulePermissionDto[];
}

export class CreateModulePermissionDto extends BaseAdminsRolesDto {
  group_id: string;

  @IsString()
  @IsNotEmpty()
  code: string;

  @IsString()
  name: string;

  @IsString()
  @IsNotEmpty()
  @IsEnum(Platform, {
    message: `Acceptable ENUM is : ['${Platform.SUPERADMIN}', '${Platform.STORES}', '${Platform.CUSTOMER}']`,
  })
  platform: string;

  @IsNumber()
  sequence: number;

  permissions: string[];
}

export class RolesQueryFilter {
  page: number;
  limit: number;
  search: string;
  platform: string;

  @IsString()
  @IsOptional()
  @IsIn(['ACTIVE', 'INACTIVE'])
  status: string;
}
