import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cities } from 'src/database/entities/cities.entity';
import { MessageService } from 'src/message/message.service';
import { ResponseService } from 'src/response/response.service';
import { CitiesController } from './cities.controller';
import { CitiesService } from './cities.service';

@Module({
  imports: [TypeOrmModule.forFeature([Cities]), HttpModule],
  exports: [CitiesService],
  controllers: [CitiesController],
  providers: [CitiesService, MessageService, ResponseService],
})
export class CitiesModule {}
