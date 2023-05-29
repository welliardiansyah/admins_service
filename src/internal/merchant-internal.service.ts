import { HttpService } from '@nestjs/axios';
import {
  BadRequestException,
  HttpStatus,
  Injectable,
  Logger,
} from '@nestjs/common';
import { catchError, EMPTY, firstValueFrom, map } from 'rxjs';
import { ResponseService } from 'src/response/response.service';

@Injectable()
export class MerchantInternalService {
  constructor(
    private readonly responseService: ResponseService,
    private readonly httpService: HttpService,
  ) {}

  async checkMerchantUserRoleIsActive(id: string): Promise<number> {
    try {
      const url = `${process.env.BASEURL_MERCHANTS_SERVICE}/api/v1/internal/merchants/profile/${id}/check-active-role`;
      const headerRequest = {
        'Content-Type': 'application/json',
      };

      return await firstValueFrom(
        this.httpService.get(url, { headers: headerRequest }).pipe(
          map((resp) => {
            const { data } = resp?.data;
            // return a count number of active user with role
            return data?.data ? data.data : 0;
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
                  error,
                ),
              );
            }
            return EMPTY;
          }),
        ),
      );
    } catch (e) {
      Logger.error(`ERROR ${e.message}`, '', 'Check Merchant User Role ID');
      throw e;
    }
  }
}
