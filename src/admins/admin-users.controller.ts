import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthJwtGuard, GetUser } from 'src/auth/auth.decorators';
import { AdminRoleGuard } from 'src/auth/guard/admin-role.guard';
import { User } from 'src/auth/guard/interface/user.interface';
import { UserType } from 'src/auth/guard/user-type.decorator';
import { ResponseStatusCode } from 'src/response/response.decorator';
import { ResponseService } from 'src/response/response.service';
import { AdminsUsersService } from './admin-users.service';
import {
  CreateAdminUserDto,
  ListAdminUserDTO,
  UpdateAdminUserDto,
} from './validation/admins-users.dto';
import { UpdateEmailUserValidation } from './validation/update_email_user.validation.dto';
import { UpdatePhoneUserValidation } from './validation/update_phone_user.validation.dto';

@Controller('api/v1/admins/users')
// @UseGuards(AdminRoleGuard)
@ResponseStatusCode()
export class AdminsUsersController {
  private LOG_CONTEXT = 'AdminController';

  constructor(
    private readonly responseService: ResponseService,
    private readonly adminsUserService: AdminsUsersService,
  ) {}

  @Post()
  // @UserType('admin')
  async createNewAdmin(@Body() payload: CreateAdminUserDto) {
    return this.adminsUserService.createNewAdminUser(payload);
  }

  @Get(':user_id')
  // @UserType('admin')
  async getAdminDetail(@Param('user_id') user_id: string) {
    return this.adminsUserService.getAdminDetail(user_id);
  }

  @Put('/:user_id')
  // @UserType('admin')
  async updateAdminDetail(
    @Param('user_id') user_id: string,
    @Body() payload: UpdateAdminUserDto,
  ) {
    payload.id = user_id;
    return this.adminsUserService.updateAdminUser(payload);
  }

  @Delete(':user_id')
  // @UserType('admin')
  async deleteAdminData(
    @GetUser() user: User,
    @Param('user_id') user_id: string,
  ) {
    return this.adminsUserService.deleteAdminUser(user, user_id).catch((e) => {
      throw e;
    });
  }

  @Get()
  // @UserType('admin')
  async getUsersAdmin(@Query() query: ListAdminUserDTO) {
    try {
      const result = await this.adminsUserService
        .getListAdmins(query)
        .catch((e) => {
          throw e;
        });

      return this.responseService.success(
        true,
        `Success get all user admins`,
        result,
      );
    } catch (ed) {
      throw ed;
    }
  }

  @Put(':uid/phone')
  // @UserType('admin')
  // @AuthJwtGuard()
  async updatePhoneUser(
    @Param('uid') user_id: string,
    @Body() payload: UpdatePhoneUserValidation,
  ) {
    return this.adminsUserService.updatePhoneUser(payload, user_id);
  }

  @Put(':uid/email')
  // @UserType('admin')
  // @AuthJwtGuard()
  async updateEmailUser(
    @Param('uid') user_id: string,
    @Body() payload: UpdateEmailUserValidation,
  ) {
    return this.adminsUserService.updateEmailUser(payload, user_id);
  }

  @Put(':uid/password')
  // @UserType('admin')
  // @AuthJwtGuard()
  async updatePasswordUser(@Param('uid') user_id: string) {
    return this.adminsUserService.updatePasswordUser(user_id);
  }

  @Post(':uid/email/resend')
  // @UserType('admin')
  // @AuthJwtGuard()
  async resendEmailUser(@Param('uid') user_id: string) {
    return this.adminsUserService.resendEmailUser(user_id);
  }

  @Post(':uid/phone/resend')
  // @UserType('admin')
  // @AuthJwtGuard()
  async resendPhoneUser(@Param('uid') user_id: string) {
    return this.adminsUserService.resendPhoneUser(user_id);
  }
}
