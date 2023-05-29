import {
  BadRequestException,
  Body,
  Controller,
  HttpStatus,
  Logger,
  Post,
} from '@nestjs/common';
import { AdminsService } from 'src/admins/admins.service';
import { MessageService } from 'src/message/message.service';
import { RMessage } from 'src/response/response.interface';
import { ResponseService } from 'src/response/response.service';
import { ApplicationDTO } from './application.dto';
import { InternalService } from './internal.service';

@Controller('api/v1/admins')
export class InternalController {
  constructor(
    private readonly internalService: InternalService,
    private readonly AdminService: AdminsService,
    private readonly responseService: ResponseService,
    private readonly messageService: MessageService,
  ) {}

  logger: Logger = new Logger();

  @Post('/users-by-id')
  async getUserById(@Body() users_id: string) {
    const ids = Object.values(users_id).shift();
    const getUsersById = await this.AdminService.findOneById(ids);

    getUsersById.password = undefined;
    getUsersById.refresh_token = undefined;
    getUsersById.token_reset_password = undefined;

    return this.responseService.success(
      true,
      `Getting user data successfully!.`,
      getUsersById,
    );
  }

  @Post('update-user')
  async updateUserAppId(@Body() data: ApplicationDTO): Promise<any> {
    const users_id: any = data.users_id;
    const apps_id: any = data.apps_id;

    const updateUser = await this.AdminService.updateApp(users_id, apps_id);
    return updateUser;
  }

  @Post('deleted-user')
  async deletedUserAppId(@Body() data: any): Promise<any> {
    const users_id: any = data.users_id;
    const apps_id = null;

    const updateUser = await this.AdminService.updateApp(users_id, apps_id);
    return updateUser;
  }
}
