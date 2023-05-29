import { HttpService } from '@nestjs/axios';
import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Logger,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { catchError, EMPTY, firstValueFrom, map } from 'rxjs';
import { AdminRoleGuard } from 'src/auth/guard/admin-role.guard';
import { UserTypeAndLevel } from 'src/auth/guard/user-type-and-level.decorator';
import { UserType } from 'src/auth/guard/user-type.decorator';
import { MerchantInternalService } from 'src/internal/merchant-internal.service';
import { MessageService } from 'src/message/message.service';
import { ResponseService } from 'src/response/response.service';
import { AdminsService } from './admins.service';
import {
  AdminsRolesDto,
  BaseAdminsRolesDto,
  ParamIdDto,
  RolesQueryFilter,
} from './validation/admins-role.dto';

@Controller('api/v1/admins/roles')
// @UseGuards(AdminRoleGuard)
export class AdminsRolesController {
  constructor(
    private readonly adminService: AdminsService,
    private readonly merchantInternalService: MerchantInternalService,
    private readonly messageService: MessageService,
    private readonly responseService: ResponseService,
    private readonly httpService: HttpService,
  ) {}

  @Post()
  // @UserType('admin')
  async createRole(@Body() payload: AdminsRolesDto) {
    try {
      const headerRequest = {
        'Content-Type': 'application/json',
      };

      const url = `${process.env.BASEURL_AUTH_SERVICE}/api/v1/auth/roles`;

      const res = await firstValueFrom(
        this.httpService.post(url, payload, { headers: headerRequest }).pipe(
          map((resp) => {
            const { data } = resp?.data;
            return data;
          }),
          catchError((err: any) => {
            Logger.error(err.message, '', 'AdminsRoles Create User Role');
            const { status, data } = err.response;
            const { error, message } = data; // status, message, error
            const { constraint, value, property } = message[0];

            if (status == HttpStatus.BAD_REQUEST) {
              throw new BadRequestException(
                this.responseService.error(HttpStatus.BAD_REQUEST, {
                  constraint: constraint,
                  property: value,
                  value: property,
                }),
                error,
              );
            }
            return EMPTY;
          }),
        ),
      );

      return this.responseService.success(
        true,
        'Success create new user role',
        res,
      );
    } catch (e) {
      Logger.error(`Error ${e.message}`, '', 'Create User Role');
      throw e;
    }
  }

  @Get('/:id')
  //@UserTypeAndLevel('admin.*', 'merchant.group', 'merchant.merchant')
  // @UserType('admin')
  async getDetailedRoles(@Param('id') id: BaseAdminsRolesDto) {
    try {
      const headerRequest = {
        'Content-Type': 'application/json',
      };
      const url = `${process.env.BASEURL_AUTH_SERVICE}/api/v1/auth/roles/${id}`;

      const res = await firstValueFrom(
        this.httpService.get(url, { headers: headerRequest }).pipe(
          map((resp) => {
            const { data } = resp?.data;
            return data;
          }),
          catchError((err: any) => {
            Logger.error(err.message, '', 'AdminsRoles Get Detailed Role');
            const { status, data } = err.response;
            const { error, message } = data; // status, message, error
            const { constraint, property, value } = message[0];

            if (status == HttpStatus.BAD_REQUEST) {
              throw new BadRequestException(
                this.responseService.error(
                  HttpStatus.BAD_REQUEST,
                  {
                    constraint: constraint,
                    value: value,
                    property: property,
                  },
                  `ERROR ${error}`,
                ),
              );
            } else if (status == HttpStatus.NOT_FOUND) {
              throw new NotFoundException(
                this.responseService.error(
                  HttpStatus.NOT_FOUND,
                  {
                    constraint: constraint,
                    property: property,
                    value: value,
                  },
                  `ERROR ${error}`,
                ),
              );
            }
            return EMPTY;
          }),
        ),
      );

      return this.responseService.success(
        true,
        'Success Get Detailed User Roles',
        res,
      );
    } catch (e) {
      Logger.error(`Error! ${e.message}`, '', 'Fetch Detailed Role');
      throw e;
    }
  }

  @Get()
  @UserTypeAndLevel('admin.*', 'merchant.group', 'merchant.merchant')
  async getRolesLists(
    @Query(new ValidationPipe({ transform: true })) query: RolesQueryFilter,
  ) {
    try {
      const headerRequest = {
        'Content-Type': 'application/json',
      };
      const url = `${process.env.BASEURL_AUTH_SERVICE}/api/v1/auth/roles`;

      const res = await firstValueFrom(
        this.httpService
          .get(url, { headers: headerRequest, params: query })
          .pipe(
            map((resp) => {
              const { data } = resp?.data;
              return data;
            }),
            catchError((err: any) => {
              Logger.error(err.message, '', 'AdminsRoles Querry User Roles');
              const { status, data } = err.response;
              const { error, message } = data; // status, message, error
              const { constraint, value, property } = message[0];

              if (status == HttpStatus.BAD_REQUEST) {
                throw new BadRequestException(
                  this.responseService.error(
                    HttpStatus.BAD_REQUEST,
                    {
                      constraint: constraint,
                      property: value,
                      value: property,
                    },
                    error,
                  ),
                );
              }
              return EMPTY;
            }),
          ),
      );

      return this.responseService.success(true, 'Success get user roles', res);
    } catch (e) {
      Logger.error(`Error! ${e.message}`, '', 'Fetch All Roles');
      throw e;
    }
  }

  @Put('/:id')
  // @UserType('admin')
  async updateRole(
    @Param('id') id: ParamIdDto,
    @Body() payload: AdminsRolesDto,
  ) {
    try {
      const headerRequest = {
        'Content-Type': 'application/json',
      };
      const url = `${process.env.BASEURL_AUTH_SERVICE}/api/v1/auth/roles/${id}`;

      const res = await firstValueFrom(
        this.httpService.put(url, payload, { headers: headerRequest }).pipe(
          map((resp) => {
            const { data } = resp?.data;
            return data;
          }),
          catchError((err: any) => {
            Logger.error(err.message, '', 'AdminsRoles Querry User Roles');
            const { status, data } = err.response;
            const { error, message } = data; // statusCode, message, error
            const { constraint, value, property } = message[0];

            if (status == HttpStatus.BAD_REQUEST) {
              throw new BadRequestException(
                this.responseService.error(
                  HttpStatus.BAD_REQUEST,
                  {
                    constraint: constraint,
                    property: value,
                    value: property,
                  },
                  error,
                ),
              );
            } else if (status == HttpStatus.NOT_FOUND) {
              throw new NotFoundException(
                this.responseService.error(
                  HttpStatus.NOT_FOUND,
                  {
                    constraint: constraint,
                    property: property,
                    value: value,
                  },
                  `ERROR ${error}`,
                ),
              );
            }
            return EMPTY;
          }),
        ),
      );

      return this.responseService.success(
        true,
        `Success update Module Permissions!`,
        res,
      );
    } catch (e) {
      Logger.error(`ERROR ${e.message}`, '', 'Update User Role');
      throw e;
    }
  }

  @Delete('/:id')
  // @UserType('admin')
  async deleteRole(@Param('id') id: string) {
    try {
      //check if role_id is active & used both in Admin and Merchant users
      const [numOfActiveRoleInMerchant, numOfActiveRoleInAdmin] =
        await Promise.all([
          await this.merchantInternalService.checkMerchantUserRoleIsActive(id),
          await this.adminService.checkAdminRoleIsActive(id),
        ]);
      if (numOfActiveRoleInMerchant > 0 || numOfActiveRoleInAdmin > 0) {
        throw new BadRequestException(
          this.responseService.error(HttpStatus.BAD_REQUEST, {
            constraint: [
              this.messageService.get('admins.general.cannotDeleteRole'),
            ],
            value: id,
            property: 'role-id',
          }),
          'Cannot Delete Role',
        );
      }

      const headerRequest = {
        'Content-Type': 'application/json',
      };
      const url = `${process.env.BASEURL_AUTH_SERVICE}/api/v1/auth/roles/${id}`;

      const res = await firstValueFrom(
        this.httpService.delete(url, { headers: headerRequest }).pipe(
          map((resp) => {
            const { data } = resp?.data;
            return data;
          }),
          catchError((err: any) => {
            const { status, data } = err.response;
            const { error, message } = data; // statusCode, message, error
            const { constraint, value, property } = message[0];

            if (status == HttpStatus.BAD_REQUEST) {
              throw new BadRequestException(
                this.responseService.error(
                  HttpStatus.BAD_REQUEST,
                  {
                    property: property,
                    value: value,
                    constraint: constraint,
                  },
                  `ERROR! Get query User Roles`,
                ),
              );
            } else if (status == HttpStatus.NOT_FOUND) {
              throw new NotFoundException(
                this.responseService.error(
                  HttpStatus.NOT_FOUND,
                  {
                    constraint: constraint,
                    property: property,
                    value: value,
                  },
                  `ERROR ${error}`,
                ),
              );
            }
            return EMPTY;
          }),
        ),
      );

      return this.responseService.success(true, `Success Delete Role!`, res);
    } catch (e) {
      Logger.error(`ERROR ${e.message}`, '', 'Delete Module Permissions');
      throw e;
    }
  }
}
