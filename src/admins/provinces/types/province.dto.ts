import { IsNotEmpty, IsString } from 'class-validator';

export class ProvinceDto {
  @IsString()
  @IsNotEmpty()
  countryId: string;

  @IsString()
  @IsNotEmpty()
  name: string;
}

export class ProvinceQueryFilterDto {
  search: string;
  limit: number;
  page: number;
  country_id: string;
}
