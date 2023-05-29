import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Headers,
  HttpStatus,
  Post,
  Put,
  Query,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { catchError, map } from 'rxjs';
import { AuthJwtGuard } from 'src/auth/auth.decorators';
import { UserType } from 'src/auth/guard/user-type.decorator';
import { deleteCredParam } from 'src/common/general-utils';
import { AuthInternalService } from 'src/internal/auth-internal.service';
import { MessageService } from 'src/message/message.service';
import { ResponseStatusCode } from 'src/response/response.decorator';
import { RMessage } from 'src/response/response.interface';
import { ResponseService } from 'src/response/response.service';
import { AdminsService } from './admins.service';
import { AdminProfileResponse } from './types';
import {
  OtpDto,
  ResponseAdminDto,
  UbahEmailDto,
  UpdateEmailDto,
  UpdatePasswordDto,
  UpdatePhoneDto,
  UpdateProfileDto,
  VerifikasiUbahEmailDto,
  VerifikasiUbahPhoneDto,
} from './validation/admins-users.dto';
import { AdminLoginEmailValidation } from './validation/admins.loginemail.validation';
import { AdminLoginPhoneValidation } from './validation/admins.loginphone.validation';
import { RequestValidationPipe } from './validation/request-validation.pipe';
import { AdminStatus } from 'src/database/entities/admins.entity';

const defaultHeadersReq: Record<string, any> = {
  'Content-Type': 'application/json',
};

@Controller('api/v1/admins')
export class AdminsController {
  constructor(
    private readonly adminService: AdminsService,
    private readonly responseService: ResponseService,
    private readonly messageService: MessageService,
    private readonly authInternalService: AuthInternalService,
  ) {}

  @Post('login/email')
  @ResponseStatusCode()
  async loginByEmail(
    @Body(RequestValidationPipe(AdminLoginEmailValidation))
    data: AdminLoginEmailValidation,
    @Query() queryData: Partial<AdminLoginEmailValidation>,
  ): Promise<any> {
    data.lang = queryData.lang ? queryData.lang : 'id';
    const existadmin = await this.adminService.findOneAdminByEmail(data.email);
    if (!existadmin) {
      const errors: RMessage = {
        value: data.email,
        property: 'email',
        constraint: [this.messageService.get('admins.login.invalid_email')],
      };
      throw new BadRequestException(
        this.responseService.error(
          HttpStatus.BAD_REQUEST,
          errors,
          'Bad Request',
        ),
      );
    }
    const validate: boolean = await this.adminService.validatePassword(
      data.password,
      existadmin.password,
    );
    if (!validate) {
      const errors: RMessage = {
        value: data.password,
        property: 'password',
        constraint: [this.messageService.get('admins.login.invalid_email')],
      };
      throw new BadRequestException(
        this.responseService.error(
          HttpStatus.BAD_REQUEST,
          errors,
          'Bad Request',
        ),
      );
    }

    if (existadmin.email_verified_at == null) {
      throw new UnauthorizedException(
        this.responseService.error(
          HttpStatus.UNAUTHORIZED,
          {
            value: data.email,
            property: 'email',
            constraint: [
              this.messageService.getLang(
                `${data.lang}.admins.general.unverifiedEmail`,
              ),
            ],
          },
          'Unauthorized',
        ),
      );
    }

    if (existadmin.status != 'ACTIVE') {
      throw new UnauthorizedException(
        this.responseService.error(
          HttpStatus.UNAUTHORIZED,
          {
            value: existadmin.status,
            property: 'status',
            constraint: [
              this.messageService.get('admins.general.unverifiedUser'),
            ],
          },
          'Unauthorized',
        ),
      );
    }

    const { id } = existadmin;
    const http_req: Record<string, any> = {
      id_profile: id,
      user_type: 'admin',
      roles: ['admin'],
    };
    const url: string = process.env.BASEURL_AUTH_SERVICE + '/api/v1/auth/login';
    return (
      await this.adminService.postHttp(url, http_req, defaultHeadersReq)
    ).pipe(
      map(async (response) => {
        const rsp: Record<string, any> = response;
        if (rsp.statusCode) {
          throw new BadRequestException(
            this.responseService.error(
              HttpStatus.BAD_REQUEST,
              rsp.message[0],
              'Bad Request',
            ),
          );
        }
        existadmin.refresh_token = response.data.refreshtoken;
        await this.adminService.updateDataAdmin(existadmin.id, existadmin);

        delete response.data.payload;
        return this.responseService.success(
          true,
          this.messageService.get('admins.login.success'),
          response.data,
        );
      }),
      catchError((err) => {
        throw err.response.data;
      }),
    );
  }

  @Post('login/phone')
  @ResponseStatusCode()
  async loginByPhone(
    @Body(RequestValidationPipe(AdminLoginPhoneValidation))
    data: AdminLoginPhoneValidation,
    @Query() queryData: Partial<AdminLoginPhoneValidation>,
  ) {
    data.lang = queryData.lang ? queryData.lang : 'id';
    const existadmin = await this.adminService.findOneAdminByPhone(data.phone);
    if (!existadmin) {
      const errors: RMessage = {
        value: data.phone,
        property: 'phone',
        constraint: [this.messageService.get('admins.login.invalid_phone')],
      };
      throw new BadRequestException(
        this.responseService.error(
          HttpStatus.BAD_REQUEST,
          errors,
          'Bad Request',
        ),
      );
    }

    if (existadmin.phone_verified_at == null) {
      throw new UnauthorizedException(
        this.responseService.error(
          HttpStatus.UNAUTHORIZED,
          {
            value: data.phone,
            property: 'phone',
            constraint: [
              this.messageService.getLang(
                `${data.lang}.admins.general.unverifiedPhone`,
              ),
            ],
          },
          'Unauthorized',
        ),
      );
    }

    if (existadmin.status != 'ACTIVE') {
      throw new UnauthorizedException(
        this.responseService.error(
          HttpStatus.UNAUTHORIZED,
          {
            value: existadmin.status,
            property: 'status',
            constraint: [
              this.messageService.get('admins.general.unverifiedUser'),
            ],
          },
          'Unauthorized',
        ),
      );
    }
    const validate: boolean = await this.adminService.validatePassword(
      data.password,
      existadmin.password,
    );
    if (!validate) {
      const errors: RMessage = {
        value: data.password,
        property: 'password',
        constraint: [this.messageService.get('admins.login.invalid_phone')],
      };
      throw new BadRequestException(
        this.responseService.error(
          HttpStatus.BAD_REQUEST,
          errors,
          'Bad Request',
        ),
      );
    }

    const { id } = existadmin;
    const http_req: Record<string, any> = {
      id_profile: id,
      user_type: 'admin',
      roles: ['admin'],
    };
    const url: string = process.env.BASEURL_AUTH_SERVICE + '/api/v1/auth/login';
    return (
      await this.adminService.postHttp(url, http_req, defaultHeadersReq)
    ).pipe(
      map(async (response) => {
        const rsp: Record<string, any> = response;
        if (rsp.statusCode) {
          throw new BadRequestException(
            this.responseService.error(
              HttpStatus.BAD_REQUEST,
              rsp.message[0],
              'Bad Request',
            ),
          );
        }
        existadmin.refresh_token = response.data.refreshtoken;
        await this.adminService.updateDataAdmin(existadmin.id, existadmin);

        delete response.data.payload;
        return this.responseService.success(
          true,
          this.messageService.get('admins.login.success'),
          response.data,
        );
      }),
      catchError((err) => {
        throw err.response.data;
      }),
    );
  }

  @Post('refresh-token')
  @UserType('admin')
  @AuthJwtGuard()
  async refreshToken(
    @Headers('Authorization') token: string,
    @Req() req: any,
  ): Promise<any> {
    token = token.replace('Bearer ', '');
    const profile = await this.adminService.findOneById(req.user.id);
    if (!profile) {
      const errors: RMessage = {
        value: '',
        property: 'payload',
        constraint: [
          this.messageService.get('admins.general.unregistered_user'),
        ],
      };
      throw new BadRequestException(
        this.responseService.error(
          HttpStatus.BAD_REQUEST,
          errors,
          'Bad Request',
        ),
      );
    }

    if (token != profile.refresh_token) {
      const errors: RMessage = {
        value: token,
        property: 'token',
        constraint: [
          this.messageService.get('admins.general.unauthorizedRefreshToken'),
        ],
      };
      throw new UnauthorizedException(
        this.responseService.error(
          HttpStatus.UNAUTHORIZED,
          errors,
          'Unauthorized',
        ),
      );
    }
    if (profile.status != AdminStatus.Active) {
      const errors: RMessage = {
        value: profile.status,
        property: 'status',
        constraint: [this.messageService.get('admins.general.unactivedUser')],
      };
      throw new UnauthorizedException(
        this.responseService.error(
          HttpStatus.UNAUTHORIZED,
          errors,
          'Unauthorized',
        ),
      );
    }

    const url: string =
      process.env.BASEURL_AUTH_SERVICE + '/api/v1/auth/refresh-token';
    const headersRequest: Record<string, any> = {
      'Content-Type': 'application/json',
      Authorization: token,
      'request-from': 'admin',
    };
    const http_req: Record<string, any> = {
      user_type: 'admin',
      roles: ['admin'],
    };

    return (
      await this.adminService.postHttp(url, http_req, headersRequest)
    ).pipe(
      map(async (response) => {
        const rsp: Record<string, any> = response;
        if (rsp.statusCode) {
          throw new BadRequestException(
            this.responseService.error(
              HttpStatus.BAD_REQUEST,
              rsp.message[0],
              'Bad Request',
            ),
          );
        }
        return this.responseService.success(
          true,
          this.messageService.get('admins.refresh_token.success'),
          response.data,
        );
      }),
      catchError((err) => {
        return err.response.data;
      }),
    );
  }

  @Get('profile')
  @UserType('admin')
  @AuthJwtGuard()
  async profile(@Req() req: any) {
    const profile = await this.adminService.findOneById(req.user.id);
    if (!profile) {
      const errors: RMessage = {
        value: '',
        property: 'payload',
        constraint: [
          this.messageService.get('admins.general.unregistered_user'),
        ],
      };
      throw new BadRequestException(
        this.responseService.error(
          HttpStatus.BAD_REQUEST,
          errors,
          'Bad Request',
        ),
      );
    }
    deleteCredParam(profile);

    let role_detail = {};
    if (profile.role_id && profile.role_id !== '') {
      role_detail = await this.authInternalService.getAdminRoleDetail(
        profile.role_id,
      );
    }

    const result = new AdminProfileResponse({
      ...profile,
      role: role_detail,
    });

    return this.responseService.success(
      true,
      'Success GET Admin Profile Detail',
      result,
    );
  }

  @Put('profile')
  @UserType('admin')
  @AuthJwtGuard()
  async updateProfile(@Req() req: any, @Body() data: UpdateProfileDto) {
    data.id = req.user.id;
    const profile = await this.adminService.updateProfile(data).catch(() => {
      const errors: RMessage = {
        value: data.name,
        property: 'profile',
        constraint: [this.messageService.get('admins.generals.dataNotFound')],
      };
      throw new BadRequestException(
        this.responseService.error(
          HttpStatus.BAD_REQUEST,
          errors,
          'Bad Request',
        ),
      );
    });
    return this.responseService.success(
      true,
      this.messageService.get('admins.general.success'),
      profile,
    );
  }

  @Put('profile/password')
  @UserType('admin')
  @AuthJwtGuard()
  async updateProfilePassword(
    @Req() req: any,
    @Body() data: UpdatePasswordDto,
  ) {
    data.id = req.user.id;
    const profile = await this.adminService.findOneById(data.id);
    if (!profile) {
      const errors: RMessage = {
        value: data.id,
        property: 'email',
        constraint: [this.messageService.get('admins.general.invalidID')],
      };
      throw new BadRequestException(
        this.responseService.error(
          HttpStatus.BAD_REQUEST,
          errors,
          'Bad Request',
        ),
      );
    }
    const validate: boolean = await this.adminService.validatePassword(
      data.old_password,
      profile.password,
    );
    if (!validate) {
      const errors: RMessage = {
        value: data.old_password,
        property: 'password',
        constraint: [
          this.messageService.get('admins.login.invalid_old_password'),
        ],
      };
      throw new BadRequestException(
        this.responseService.error(
          HttpStatus.BAD_REQUEST,
          errors,
          'Bad Request',
        ),
      );
    }
    const updateResult = await this.adminService.updatePassword(data);
    return this.responseService.success(
      true,
      this.messageService.get('admins.general.success'),
      updateResult,
    );
  }

  @Post('profile/verify-email')
  @UserType('admin')
  @AuthJwtGuard()
  async updateEmail(@Req() req: any, @Body() data: UbahEmailDto) {
    return this.adminService.ubahEmail(data, req.user);
  }

  @Post('profile/verify-email/resend')
  @UserType('admin')
  @AuthJwtGuard()
  async resendEmailUser(@Req() req: any) {
    return this.adminService.resendEmailUser(req.user.id);
  }

  @Post('verifications/email')
  async verifikasiUbahEmail(@Body() data: VerifikasiUbahEmailDto) {
    return this.adminService.verifikasiUbahEmail(data);
  }

  @Post('verifications/phone')
  async verifikasiUbahTelepon(@Body() data: VerifikasiUbahPhoneDto) {
    return this.adminService.verifikasiUbahTelepon(data);
  }

  @Post('profile/verify-email-validation')
  @UserType('admin')
  @AuthJwtGuard()
  async updateEmailValidation(@Req() req: any, @Body() data: UpdateEmailDto) {
    const url: string =
      process.env.BASEURL_AUTH_SERVICE + '/api/v1/auth/otp-email-validation';
    const defaultJsonHeader: Record<string, any> = {
      'Content-Type': 'application/json',
    };
    const existEmail = await this.adminService.findOneAdminByEmail(data.email);
    if (existEmail) {
      const errors: RMessage = {
        value: data.email,
        property: 'email',
        constraint: [this.messageService.get('admins.general.emailExist')],
      };
      throw new BadRequestException(
        this.responseService.error(
          HttpStatus.BAD_REQUEST,
          errors,
          'Bad Request',
        ),
      );
    }
    const userData = await this.adminService.findOneById(req.user.id);
    const otpDto = new OtpDto();
    otpDto.email = data.email;
    otpDto.otp_code = data.otp_code;
    otpDto.id = userData.id;
    otpDto.user_type = 'admin';
    return (
      await this.adminService.postHttp(url, otpDto, defaultJsonHeader)
    ).pipe(
      map(async (response) => {
        const rsp: Record<string, any> = response;

        if (rsp.success) {
          data.id = userData.id;
          const updateResult = await this.adminService.updateEmail(data);
          const responseAdminDto = new ResponseAdminDto();
          responseAdminDto.id = updateResult.id;
          responseAdminDto.email = updateResult.email;
          responseAdminDto.name = updateResult.name;
          responseAdminDto.nip = updateResult.nip;
          responseAdminDto.phone = updateResult.phone;
          responseAdminDto.created_at = updateResult.created_at;
          responseAdminDto.updated_at = updateResult.updated_at;
          responseAdminDto.deleted_at = updateResult.deleted_at;
          responseAdminDto.email_verified_at = updateResult.email_verified_at;
          responseAdminDto.phone_verified_at = updateResult.phone_verified_at;
          return this.responseService.success(
            true,
            this.messageService.get('admins.general.success'),
            responseAdminDto,
          );
        }
        return response;
      }),
      catchError((err) => {
        throw new BadRequestException(
          this.responseService.error(
            HttpStatus.BAD_REQUEST,
            err.response.data,
            'Bad Request',
          ),
        );
      }),
    );
  }

  @Post('profile/verify-phone')
  @UserType('admin')
  @AuthJwtGuard()
  async updatePhone(@Req() req: any, @Body() data: UpdatePhoneDto) {
    const url: string =
      process.env.BASEURL_AUTH_SERVICE + '/api/v1/auth/otp-phone';
    const defaultJsonHeader: Record<string, any> = {
      'Content-Type': 'application/json',
    };
    const existEmail = await this.adminService.findOneAdminByPhone(data.phone);
    if (existEmail) {
      const errors: RMessage = {
        value: data.phone,
        property: 'phone',
        constraint: [this.messageService.get('admins.general.phoneExist')],
      };
      throw new BadRequestException(
        this.responseService.error(
          HttpStatus.BAD_REQUEST,
          errors,
          'Bad Request',
        ),
      );
    }
    const userData = await this.adminService.findOneById(req.user.id);
    const otpDto = new OtpDto();
    otpDto.phone = data.phone;
    otpDto.name = userData.name;
    otpDto.id_otp = userData.id;
    otpDto.user_type = 'admin';
    return (
      await this.adminService.postHttp(url, otpDto, defaultJsonHeader)
    ).pipe(
      map(async (response) => {
        const rsp: Record<string, any> = response;

        if (rsp.statusCode) {
          throw new BadRequestException(
            this.responseService.error(
              HttpStatus.BAD_REQUEST,
              rsp.message[0],
              'Bad Request',
            ),
          );
        }
        return response;
      }),
      catchError((err) => {
        throw err.response.data;
      }),
    );
  }

  @Post('profile/verify-phone-validation')
  @UserType('admin')
  @AuthJwtGuard()
  async updatePhoneValidation(@Req() req: any, @Body() data: UpdatePhoneDto) {
    const url: string =
      process.env.BASEURL_AUTH_SERVICE + '/api/v1/auth/otp-phone-validation';
    const defaultJsonHeader: Record<string, any> = {
      'Content-Type': 'application/json',
    };
    const existEmail = await this.adminService.findOneAdminByPhone(data.phone);
    if (existEmail) {
      const errors: RMessage = {
        value: data.phone,
        property: 'phone',
        constraint: [this.messageService.get('admins.general.emailExist')],
      };
      throw new BadRequestException(
        this.responseService.error(
          HttpStatus.BAD_REQUEST,
          errors,
          'Bad Request',
        ),
      );
    }
    const userData = await this.adminService.findOneById(req.user.id);
    const otpDto = new OtpDto();
    otpDto.phone = data.phone;
    otpDto.otp_code = data.otp_code;
    otpDto.id = userData.id;
    otpDto.user_type = 'admin';
    return (
      await this.adminService.postHttp(url, otpDto, defaultJsonHeader)
    ).pipe(
      map(async (response) => {
        const rsp: Record<string, any> = response;

        if (rsp.success) {
          data.id = userData.id;
          const updateResult = await this.adminService.updatePhone(data);
          const responseAdminDto = new ResponseAdminDto();
          responseAdminDto.id = updateResult.id;
          responseAdminDto.email = updateResult.email;
          responseAdminDto.name = updateResult.name;
          responseAdminDto.nip = updateResult.nip;
          responseAdminDto.phone = updateResult.phone;
          responseAdminDto.created_at = updateResult.created_at;
          responseAdminDto.updated_at = updateResult.updated_at;
          responseAdminDto.deleted_at = updateResult.deleted_at;
          responseAdminDto.email_verified_at = updateResult.email_verified_at;
          responseAdminDto.phone_verified_at = updateResult.phone_verified_at;
          return this.responseService.success(
            true,
            this.messageService.get('admins.general.success'),
            responseAdminDto,
          );
        }
        const errors: RMessage = {
          value: data.otp_code,
          property: 'otp_code',
          constraint: [this.messageService.get('admins.login.invalid')],
        };
        throw new BadRequestException(
          this.responseService.error(
            HttpStatus.BAD_REQUEST,
            errors,
            'Bad Request',
          ),
        );
      }),
      catchError((err) => {
        throw new BadRequestException(
          this.responseService.error(
            HttpStatus.BAD_REQUEST,
            err.response.data,
            'Bad Request',
          ),
        );
      }),
    );
  }
}
