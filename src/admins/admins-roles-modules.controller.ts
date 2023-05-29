import { HttpService } from '@nestjs/axios';
import {
  BadRequestException,
  Body,
  ConflictException,
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
} from '@nestjs/common';
import { firstValueFrom, map, catchError, EMPTY } from 'rxjs';
import { AdminRoleGuard } from 'src/auth/guard/admin-role.guard';
import { UserTypeAndLevel } from 'src/auth/guard/user-type-and-level.decorator';
import { UserType } from 'src/auth/guard/user-type.decorator';
import { ResponseService } from 'src/response/response.service';
import {
  CreateModulePermissionDto,
  ParamIdDto,
  RolesQueryFilter,
} from './validation/admins-role.dto';

@Controller('api/v1/admins/roles/modules')
// @UseGuards(AdminRoleGuard)
export class AdminsRolesModulesController {
  constructor(
    private readonly responseService: ResponseService,
    private readonly httpService: HttpService,
  ) {}

  @Post()
  // @UserType('admin')
  async createModulePermissions(@Body() payload: CreateModulePermissionDto) {
    try {
      const headerRequest = {
        'Content-Type': 'application/json',
      };

      const url = `${process.env.BASEURL_AUTH_SERVICE}/api/v1/auth/roles/modules`;

      const res = await firstValueFrom(
        this.httpService.post(url, payload, { headers: headerRequest }).pipe(
          map((resp) => {
            const { data } = resp?.data;
            return data;
          }),
          catchError((err: any) => {
            Logger.error(err.message, '', 'AdminsRoles Create Module');

            const { status, data } = err.response;
            const { error, message } = data; // statusCode, message, error
            const { constraint, value, property } = message[0];

            if (status == HttpStatus.BAD_REQUEST) {
              throw new BadRequestException(
                this.responseService.error(HttpStatus.BAD_REQUEST, {
                  constraint: constraint,
                  property: property,
                  value: value,
                }),
                `ERROR Create Module Permission`,
              );
            } else if (status == HttpStatus.CONFLICT) {
              throw new ConflictException(
                this.responseService.error(HttpStatus.CONFLICT, {
                  constraint: constraint,
                  property: property,
                  value: value,
                }),
                `ERROR ${error}`,
              );
            } else if (status == HttpStatus.NOT_FOUND) {
              throw new NotFoundException(
                this.responseService.error(HttpStatus.NOT_FOUND, {
                  constraint: constraint,
                  property: property,
                  value: value,
                }),
                `ERROR ${error}`,
              );
            }
            return EMPTY;
          }),
        ),
      );

      return this.responseService.success(
        true,
        'Success create module permissions',
        res,
      );
    } catch (e) {
      Logger.error(`ERROR ${e.message}`, '', 'POST Module Permissions');
      throw e;
    }
  }

  @Delete('/:id')
  // @UserType('admin')
  async deleteModulePermissions(@Param('id') id: ParamIdDto) {
    try {
      const headerRequest = {
        'Content-Type': 'application/json',
      };
      const url = `${process.env.BASEURL_AUTH_SERVICE}/api/v1/auth/roles/modules/${id}`;

      const res = await firstValueFrom(
        this.httpService.delete(url, { headers: headerRequest }).pipe(
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
                    constraint: [error],
                    property: null,
                    value: null,
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

      return this.responseService.success(
        true,
        `Success update Module Permissions!`,
        res,
      );
    } catch (e) {
      Logger.error(`ERROR ${e.message}`, '', 'DELETE Module Permissions');
      throw e;
    }
  }

  @Get()
  @UserTypeAndLevel('admin.*', 'merchant.group', 'merchant.merchant')
  async getListsModules(@Query() query: RolesQueryFilter) {
    try {
      const headerRequest = {
        'Content-Type': 'application/json',
      };

      const url = `${process.env.BASEURL_AUTH_SERVICE}/api/v1/auth/roles/modules`;

      const res = await firstValueFrom(
        this.httpService
          .get(url, { headers: headerRequest, params: query })
          .pipe(
            map((resp) => {
              const { data } = resp?.data;
              return data;
            }),
            catchError((err: any) => {
              Logger.error(err.message, '', 'AdminsRoles Query Modules');
              const { status, data } = err.response;
              const { error } = data; // statusCode, message, error

              if (status == HttpStatus.BAD_REQUEST) {
                throw new BadRequestException(
                  this.responseService.error(HttpStatus.BAD_REQUEST, {
                    constraint: [error],
                    property: null,
                    value: null,
                  }),
                  `Error get Permissions Modules`,
                );
              }
              return EMPTY;
            }),
          ),
      );

      return this.responseService.success(
        true,
        'Success Update user role',
        res,
      );
    } catch (e) {
      Logger.error(` ${e.message}`, '', `GET Query List Permissions`);
      throw e;
    }
  }

  @Get('/:id')
  @UserTypeAndLevel('admin.*', 'merchant.group', 'merchant.merchant')
  async getDetailedModule(@Param('id') id: ParamIdDto) {
    try {
      const headerRequest = {
        'Content-Type': 'application/json',
      };

      const url = `${process.env.BASEURL_AUTH_SERVICE}/api/v1/auth/roles/modules/${id}`;

      const res = await firstValueFrom(
        this.httpService.get(url, { headers: headerRequest }).pipe(
          map((resp) => {
            const { data } = resp?.data;
            return data;
          }),
          catchError((err: any) => {
            Logger.error(err.message, '', 'GET Detail by ID');
            const { status, data } = err.response;
            const { error, message } = data; // statusCode, message, error
            const { constraint, property, value } = message[0];

            if (status == HttpStatus.BAD_REQUEST) {
              throw new BadRequestException(
                this.responseService.error(HttpStatus.BAD_REQUEST, {
                  constraint: [error],
                  property: null,
                  value: null,
                }),
                `ERROR GET Permission Modules By ID`,
              );
            } else if (status == HttpStatus.NOT_FOUND) {
              throw new NotFoundException(
                this.responseService.error(HttpStatus.NOT_FOUND, {
                  constraint: constraint,
                  property: property,
                  value: value,
                }),
                `ERROR GET Permission Modules By ID`,
              );
            }
            return EMPTY;
          }),
        ),
      );
      return this.responseService.success(
        true,
        'Success Get Module Detail by module id',
        res,
      );
    } catch (e) {
      Logger.error(` ${e.message}`, '', `GET Query List Permissions`);
      throw e;
    }
  }

  @Put('/:id')
  @UserTypeAndLevel('admin.*', 'merchant.group', 'merchant.merchant')
  async updateModulePermissions(
    @Param('id') id: ParamIdDto,
    @Body() payload: CreateModulePermissionDto,
  ) {
    try {
      const headerRequest = {
        'Content-Type': 'application/json',
      };
      const url = `${process.env.BASEURL_AUTH_SERVICE}/api/v1/auth/roles/modules/${id}`;

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
                    property: property,
                    value: value,
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

      return this.responseService.success(
        true,
        `Success update Module Permissions!`,
        res,
      );
    } catch (e) {
      Logger.error(`ERROR ${e.message}`, '', 'PUT Module Permissions');
      throw e;
    }
  }
}
