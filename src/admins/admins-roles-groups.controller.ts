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
import { ParamIdDto, RolesQueryFilter } from './validation/admins-role.dto';

@Controller('api/v1/admins/roles/groups')
// @UseGuards(AdminRoleGuard)
export class AdminsRolesGroupsController {
  constructor(
    private readonly responseService: ResponseService,
    private readonly httpService: HttpService,
  ) {}

  @Post()
  // @UserType('admin')
  async createModuleGroup(@Body() payload: Record<string, any>) {
    try {
      const headerRequest = {
        'Content-Type': 'application/json',
      };

      const url = `${process.env.BASEURL_AUTH_SERVICE}/api/v1/auth/roles/groups`;

      const res = await firstValueFrom(
        this.httpService.post(url, payload, { headers: headerRequest }).pipe(
          map((resp) => {
            const { data } = resp?.data;
            return data;
          }),
          catchError((err: any) => {
            Logger.error(err.message, '', 'AdminsRoles Create Group Module');

            const { status, data } = err.response;
            const { error, message } = data; // statusCode, message, error
            const { constraint, value, property } = message[0];

            if (status == HttpStatus.BAD_REQUEST) {
              throw new BadRequestException(
                this.responseService.error(HttpStatus.BAD_REQUEST, {
                  constraint: constraint,
                  property: value,
                  value: property,
                }),
                `ERROR! Create Group Module!`,
              );
            } else if (status == HttpStatus.CONFLICT) {
              throw new ConflictException(
                this.responseService.error(HttpStatus.CONFLICT, {
                  constraint: constraint,
                  property: value,
                  value: property,
                }),
                `ERROR! ${error}`,
              );
            }
            return EMPTY;
          }),
        ),
      );

      return this.responseService.success(
        true,
        'Success Create Group Module!',
        res,
      );
    } catch (e) {
      Logger.error(`ERROR! ${e.message}`, '', 'POST Group Modules');
      throw e;
    }
  }

  @Delete('/:id')
  // @UserType('admin')
  async deleteModuleGroups(@Param('id') id: ParamIdDto) {
    try {
      const headerRequest = {
        'Content-Type': 'application/json',
      };
      const url = `${process.env.BASEURL_AUTH_SERVICE}/api/v1/auth/roles/groups/${id}`;

      const res = await firstValueFrom(
        this.httpService.delete(url, { headers: headerRequest }).pipe(
          map((resp) => {
            const { data } = resp?.data;
            return data;
          }),
          catchError((err: any) => {
            Logger.error(err.message, '', 'AdminsRoles Delete Group Modules');
            const { status, data } = err.response;
            const { error } = data; // statusCode, message, error

            if (status == HttpStatus.BAD_REQUEST) {
              throw new BadRequestException(
                this.responseService.error(
                  HttpStatus.BAD_REQUEST,
                  {
                    constraint: [error],
                    property: null,
                    value: null,
                  },
                  `ERROR! Delete Group Module!`,
                ),
              );
            }
            return EMPTY;
          }),
        ),
      );

      return this.responseService.success(
        true,
        `Success Delete Group Module!`,
        res,
      );
    } catch (e) {
      Logger.error(`ERROR! ${e.message}`, '', 'DELETE Group Modules');
      throw e;
    }
  }

  @Get()
  @UserTypeAndLevel('admin.*', 'merchant.group', 'merchant.merchant')
  async getModuleGroups(@Query() query: RolesQueryFilter) {
    try {
      const headerRequest = {
        'Content-Type': 'application/json',
      };

      const url = `${process.env.BASEURL_AUTH_SERVICE}/api/v1/auth/roles/groups`;

      const res = await firstValueFrom(
        this.httpService
          .get(url, { headers: headerRequest, params: query })
          .pipe(
            map((resp) => {
              const { data } = resp?.data;
              return data;
            }),
            catchError((err: any) => {
              Logger.error(err.message, '', 'AdminsRoles Query Group Modules');
              const { status, data } = err.response;
              const { error } = data; // statusCode, message, error

              if (status == HttpStatus.BAD_REQUEST) {
                throw new BadRequestException(
                  this.responseService.error(HttpStatus.BAD_REQUEST, {
                    constraint: [error],
                    property: null,
                    value: null,
                  }),
                  `ERROR! Query Group Modules!`,
                );
              }
              return EMPTY;
            }),
          ),
      );

      return this.responseService.success(
        true,
        'Success Get Group Modules Lists!',
        res,
      );
    } catch (e) {
      Logger.error(`ERROR! ${e.message}`, '', `GET Group Modules`);
      throw e;
    }
  }

  @Get('/:id')
  @UserTypeAndLevel('admin.*', 'merchant.group', 'merchant.merchant')
  async getDetailedModuleGroup(@Param('id') id: ParamIdDto) {
    try {
      const headerRequest = {
        'Content-Type': 'application/json',
      };
      const url = `${process.env.BASEURL_AUTH_SERVICE}/api/v1/auth/roles/groups/${id}`;

      const result = await firstValueFrom(
        this.httpService.get(url, { headers: headerRequest }).pipe(
          map((resp) => {
            const { data } = resp?.data;
            return data;
          }),
          catchError((err: any) => {
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
                error,
              );
            } else if (status == HttpStatus.NOT_FOUND) {
              throw new NotFoundException(
                this.responseService.error(HttpStatus.NOT_FOUND, {
                  constraint: constraint,
                  property: property,
                  value: value,
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
        'Success GET Detailed Module Group by ID',
        result,
      );
    } catch (e) {
      Logger.error(`ERROR ${e.message}`, '', 'GET Detailed Module Group by ID');
      throw e;
    }
  }

  @Put('/:id')
  // @UserType('admin')
  async updateModuleGroup(
    @Param('id') id: ParamIdDto,
    @Body() payload: Record<string, any>,
  ) {
    try {
      const headerRequest = {
        'Content-Type': 'application/json',
      };
      const url = `${process.env.BASEURL_AUTH_SERVICE}/api/v1/auth/roles/groups/${id}`;

      const res = await firstValueFrom(
        this.httpService.put(url, payload, { headers: headerRequest }).pipe(
          map((resp) => {
            const { data } = resp?.data;
            return data;
          }),
          catchError((err: any) => {
            Logger.error(err.message, '', 'AdminsRoles Update Group Modules');
            const { status, data } = err.response;
            const { error, message } = data; // statusCode, message, error
            const { constraint, property, value } = message[0];

            if (status == HttpStatus.BAD_REQUEST) {
              throw new BadRequestException(
                this.responseService.error(
                  HttpStatus.BAD_REQUEST,
                  {
                    constraint: constraint,
                    property: property,
                    value: value,
                  },
                  error,
                ),
              );
            }
            return EMPTY;
          }),
        ),
      );

      return this.responseService.success(
        true,
        `Success Update Group Modules!`,
        res,
      );
    } catch (e) {
      Logger.error(`ERROR! ${e.message}`, '', 'PUT Group Module');
      throw e;
    }
  }
}
