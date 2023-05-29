import { HttpService } from '@nestjs/axios';
import {
  BadRequestException,
  Controller,
  HttpStatus,
  Logger,
  Param,
  Post,
} from '@nestjs/common';
import { MessageService } from 'src/message/message.service';
import { RMessage } from 'src/response/response.interface';
import { ResponseService } from 'src/response/response.service';
import { InternalPostalCodesService } from './postal_codes.service';

@Controller('api/v1/admins/internal/postal-code')
export class InternalPostalCodeController {
  constructor(
    private readonly internalPostalCodes: InternalPostalCodesService,
    private readonly responseService: ResponseService,
    private readonly messageService: MessageService,
    private httpService: HttpService,
  ) {}

  logger: Logger = new Logger();

  @Post(':postalcode')
  async getPostalCodeDetail(@Param('postalcode') postal_code: string) {
    const result =
      await this.internalPostalCodes.getPostalCodesDetailByPostalCode(
        postal_code,
      );
    if (!result) {
      const errors: RMessage = {
        value: postal_code,
        property: 'postal_code',
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
    return this.responseService.success(
      true,
      this.messageService.get('admins.login.success'),
      result,
    );
  }
}
