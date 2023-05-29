import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AdminsModule } from './admins/admins.module';
import { DatabaseService } from './database/database.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { InternalModule } from './internal/internal.module';
import { CommonModule } from './common/common.module';
import { BullModule } from '@nestjs/bull';
import { SeederModule } from './database/seeders/seeder.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      useClass: DatabaseService,
    }),
    BullModule.forRoot({
      redis: {
        host: process.env.REDIS_HOST,
        port: +process.env.REDIS_PORT,
        password: process.env.REDIS_PASSWORD,
      },
    }),
    AdminsModule,
    AuthModule,
    InternalModule,
    CommonModule,
    SeederModule,
  ],
})
export class AppModule {}
