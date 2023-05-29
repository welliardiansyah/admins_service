import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Countries } from 'src/database/entities/countries.entity';
import { CountriesSeederService } from './countries.service';

/**
 * Import and provide seeder classes for countrys.
 *
 * @module
 */
@Module({
  imports: [TypeOrmModule.forFeature([Countries])],
  providers: [CountriesSeederService],
  exports: [CountriesSeederService],
})
export class CountriesSeederModule {}
