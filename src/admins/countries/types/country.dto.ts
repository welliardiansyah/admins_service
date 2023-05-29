import { IsNotEmpty, IsString } from 'class-validator';

export class CountriesDto {
  @IsString()
  @IsNotEmpty()
  name: string;
}
