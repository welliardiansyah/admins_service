import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostalCodes } from 'src/database/entities/postal_codes.entity';
import { MessageService } from 'src/message/message.service';
import { ResponseService } from 'src/response/response.service';
import { InternalPostalCodeController } from './postal_codes.controller';
import { InternalPostalCodesService } from './postal_codes.service';

@Module({
  imports: [TypeOrmModule.forFeature([PostalCodes]), HttpModule],
  controllers: [InternalPostalCodeController],
  providers: [InternalPostalCodesService, MessageService, ResponseService],
})
export class InternalPostalCodesModule {}
