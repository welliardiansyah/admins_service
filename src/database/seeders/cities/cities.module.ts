import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cities } from 'src/database/entities/cities.entity';
import { CitiesSeederService } from './cities.service';

/**
 * Import and provide seeder classes for countrys.
 *
 * @module
 */
@Module({
  imports: [TypeOrmModule.forFeature([Cities])],
  providers: [CitiesSeederService],
  exports: [CitiesSeederService],
})
export class CitiesSeederModule {}
