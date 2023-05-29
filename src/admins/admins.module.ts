import { Module } from '@nestjs/common';
import { AdminsService } from './admins.service';
import { AdminsController } from './admins.controller';
import { AdminsDocument } from 'src/database/entities/admins.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Countries } from 'src/database/entities/countries.entity';
import { Provinces } from 'src/database/entities/provinces.entity';
import { Cities } from 'src/database/entities/cities.entity';
import { PostalCodes } from 'src/database/entities/postal_codes.entity';
import { AdminsUsersController } from './admin-users.controller';
import { ResetPasswordController } from './reset-password.controller';
import { ResetPasswordService } from './reset-password.service';
import { CommonService } from 'src/common/common.service';
// import { HashModule } from 'src/hash/hash.module';
import { CitiesModule } from './cities/cities.module';
import { ProvincesModule } from './provinces/provinces.module';
import { CountriesModule } from './countries/countries.module';
import { AdminsRolesController } from './admins-roles.controller';
import { AdminsRolesModulesController } from './admins-roles-modules.controller';
import { AdminsRolesGroupsController } from './admins-roles-groups.controller';
import { AdminsUsersService } from './admin-users.service';
import { InternalModule } from 'src/internal/internal.module';
import { RoleService } from 'src/common/auth/role.service';
import { HttpModule } from '@nestjs/axios';
import { MessageService } from 'src/message/message.service';
import { ResponseService } from 'src/response/response.service';
import { HashService } from 'src/hash/hash.service';
import { ConfigService } from '@nestjs/config';
import { EmailsService } from 'src/common/emails/emails.service';
import { SmsService } from 'src/common/sms/sms.service';
// import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      AdminsDocument,
      Countries,
      Provinces,
      Cities,
      PostalCodes,
    ]),
    HttpModule,
    // HashModule,
    CitiesModule,
    ProvincesModule,
    CountriesModule,
    InternalModule,
    // JwtModule,
  ],
  exports: [AdminsService, AdminsUsersService],
  providers: [
    AdminsService,
    ResetPasswordService,
    CommonService,
    AdminsUsersService,
    RoleService,
    MessageService,
    ResponseService,
    HashService,
    ConfigService,
    EmailsService,
    SmsService,
    // JwtService,
  ],
  controllers: [
    AdminsController,
    AdminsUsersController,
    AdminsRolesModulesController,
    AdminsRolesGroupsController,
    AdminsRolesController,
    ResetPasswordController,
  ],
})
export class AdminsModule {}
