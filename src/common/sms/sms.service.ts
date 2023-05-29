import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { firstValueFrom, map } from 'rxjs';

@Injectable()
export class SmsService {
  constructor(private readonly httpService: HttpService) {}

  logger = new Logger();

  async sendSms(phone: string): Promise<void> {
    const url = `${process.env.BASEURL_SMS_SERVICE}/api/v1/sms`;

    try {
      await firstValueFrom(
        this.httpService
          .post(url, { phone })
          .pipe(map((response: any) => response.data)),
      );
    } catch (err) {
      console.error(err.response.data);
    }
  }
}
