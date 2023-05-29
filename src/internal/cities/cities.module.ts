import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { InternalCitiesController } from './cities.controller';
import { InternalCitiesService } from './cities.service';

@Module({
  imports: [HttpModule],
  controllers: [InternalCitiesController],
  providers: [InternalCitiesService],
})
export class InternalCitiessModule {}
