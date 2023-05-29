import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminsService } from 'src/admins/admins.service';
import { CitiesService } from 'src/admins/cities/cities.service';
import { AdminsDocument } from 'src/database/entities/admins.entity';
import { Cities } from 'src/database/entities/cities.entity';
import { PostalCodes } from 'src/database/entities/postal_codes.entity';
import { HashService } from 'src/hash/hash.service';
import { MessageService } from 'src/message/message.service';
import { ResponseService } from 'src/response/response.service';
import { AuthInternalService } from './auth-internal.service';
import { InternalCitiesController } from './cities/cities.controller';
import { InternalCitiesService } from './cities/cities.service';
import { InternalController } from './internal.controller';
import { InternalService } from './internal.service';
import { MerchantInternalService } from './merchant-internal.service';
import { InternalPostalCodeController } from './postal_code/postal_codes.controller';
import { InternalPostalCodesModule } from './postal_code/postal_codes.module';
import { InternalPostalCodesService } from './postal_code/postal_codes.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([PostalCodes, Cities, AdminsDocument]),
    HttpModule,
    InternalPostalCodesModule,
  ],
  controllers: [
    InternalController,
    InternalPostalCodeController,
    InternalCitiesController,
  ],
  providers: [
    InternalService,
    AuthInternalService,
    InternalPostalCodesService,
    InternalCitiesService,
    MerchantInternalService,
    CitiesService,
    ResponseService,
    MessageService,
    ConfigService,
    AdminsService,
    HashService,
  ],
  exports: [AuthInternalService, MerchantInternalService],
})
export class InternalModule {}
