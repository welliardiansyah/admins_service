import { Body, Controller, Post, Query } from '@nestjs/common';

import { ResponseStatusCode } from 'src/response/response.decorator';
import { UpdateAdminUserDto } from './validation/admins-users.dto';
import { ResetPasswordService } from './reset-password.service';

@Controller('api/v1/admins/reset-password')
export class ResetPasswordController {
  constructor(private readonly resetPasswordService: ResetPasswordService) {}

  @Post('email')
  @ResponseStatusCode()
  async resetPassEmail(
    @Body()
    args: Partial<UpdateAdminUserDto>,
  ): Promise<any> {
    return this.resetPasswordService.resetPasswordEmail(args);
  }

  @Post('phone')
  @ResponseStatusCode()
  async resetPassPhone(
    @Body()
    args: Partial<UpdateAdminUserDto>,
  ): Promise<any> {
    return this.resetPasswordService.resetPasswordPhone(args);
  }

  @Post('password')
  @ResponseStatusCode()
  async resetPassPassword(
    @Body()
    args: Partial<UpdateAdminUserDto>,
    @Query() qstring: Record<string, any>,
  ): Promise<any> {
    return this.resetPasswordService.resetPasswordExec(args, qstring);
  }
}
