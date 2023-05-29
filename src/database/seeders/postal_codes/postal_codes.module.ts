import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostalCodes } from 'src/database/entities/postal_codes.entity';
import { PostalCodesSeederService } from './postal_codes.service';

/**
 * Import and provide seeder classes for countrys.
 *
 * @module
 */
@Module({
  imports: [TypeOrmModule.forFeature([PostalCodes])],
  providers: [PostalCodesSeederService],
  exports: [PostalCodesSeederService],
})
export class PostalCodesSeederModule {}
