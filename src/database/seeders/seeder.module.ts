import { Logger, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
// import { DatabaseService } from '../database.service';
import { CitiesSeederModule } from './cities/cities.module';
import { CountriesSeederModule } from './countries/countries.module';
import { PostalCodesSeederModule } from './postal_codes/postal_codes.module';
import { ProvincesSeederModule } from './provinces/provinces.module';
import { Seeder } from './seeder';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forFeature(),
    // TypeOrmModule.forRootAsync({
    //   useClass: DatabaseService,
    // }),
    CountriesSeederModule,
    ProvincesSeederModule,
    CitiesSeederModule,
    PostalCodesSeederModule,
  ],
  providers: [Logger, Seeder],
})
export class SeederModule {}
