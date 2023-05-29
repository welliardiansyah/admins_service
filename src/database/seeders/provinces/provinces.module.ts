import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Provinces } from 'src/database/entities/provinces.entity';
import { ProvincesSeederService } from './provinces.service';

/**
 * Import and provide seeder classes for countrys.
 *
 * @module
 */
@Module({
  imports: [TypeOrmModule.forFeature([Provinces])],
  providers: [ProvincesSeederService],
  exports: [ProvincesSeederService],
})
export class ProvincesSeederModule {}
