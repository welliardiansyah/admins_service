import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Countries } from 'src/database/entities/countries.entity';
import { MessageService } from 'src/message/message.service';
import { ResponseService } from 'src/response/response.service';
import { CountriesController } from './countries.controller';
import { CountriesService } from './countries.service';

@Module({
  imports: [TypeOrmModule.forFeature([Countries]), HttpModule],
  exports: [CountriesService],
  controllers: [CountriesController],
  providers: [CountriesService, MessageService, ResponseService],
})
export class CountriesModule {}
