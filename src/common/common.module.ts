import { Global, Module } from '@nestjs/common';
import { HttpModule, HttpModule as HttpModuleAxios } from '@nestjs/axios';
import { CommonService } from './common.service';
import { RoleService } from './auth/role.service';
import { MessageService } from 'src/message/message.service';
import { DriverType, StorageModule } from '@codebrew/nestjs-storage';
import { ResponseService } from 'src/response/response.service';
import { BullModule } from '@nestjs/bull';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CitiesService } from 'src/admins/cities/cities.service';
import { Cities } from 'src/database/entities/cities.entity';
import { EmailsService } from './emails/emails.service';
import { SmsService } from './sms/sms.service';

@Global()
@Module({
  imports: [
    StorageModule.forRoot({
      default: process.env.STORAGE_S3_STORAGE || 'local',
      disks: {
        local: {
          driver: DriverType.LOCAL,
          config: {
            root: process.cwd(),
          },
        },
        s3: {
          driver: DriverType.S3,
          config: {
            key: process.env.STORAGE_S3_KEY || '',
            secret: process.env.STORAGE_S3_SECRET || '',
            bucket: process.env.STORAGE_S3_BUCKET || '',
            region: process.env.STORAGE_S3_REGION || '',
          },
        },
      },
    }),
    HttpModule,
    HttpModuleAxios,
    BullModule.registerQueue({
      name: 'admins',
    }),
    TypeOrmModule.forFeature([Cities]),
  ],
  providers: [
    CommonService,
    RoleService,
    MessageService,
    ResponseService,
    CitiesService,
    EmailsService,
    SmsService,
  ],
  exports: [HttpModule],
})
export class CommonModule {}
