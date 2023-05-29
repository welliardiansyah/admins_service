import { IsNotEmpty, IsString } from 'class-validator';

export class CitiesDto {
  @IsString()
  @IsNotEmpty()
  provinceId: string;

  @IsString()
  @IsNotEmpty()
  name: string;
}

export class CitiesQueryFilterDto {
  search: string;
  limit: number;
  page: number;
  province_id: string;
}
