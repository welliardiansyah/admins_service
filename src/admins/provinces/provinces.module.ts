import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Provinces } from 'src/database/entities/provinces.entity';
import { MessageService } from 'src/message/message.service';
import { ResponseService } from 'src/response/response.service';
import { ProvincesController } from './provinces.controller';
import { ProvincesService } from './provinces.service';

@Module({
  imports: [TypeOrmModule.forFeature([Provinces]), HttpModule],
  exports: [ProvincesService],
  controllers: [ProvincesController],
  providers: [ProvincesService, MessageService, ResponseService],
})
export class ProvincesModule {}
