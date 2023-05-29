import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { firstValueFrom, map } from 'rxjs';

@Injectable()
export class EmailsService {
  constructor(private readonly httpService: HttpService) {}

  logger = new Logger();

  async sendEmail(
    email: string,
    subject: string,
    message: string,
  ): Promise<void> {
    const url = `${process.env.BASEURL_EMAIL_SERVICE}/api/v1/emails`;

    try {
      await firstValueFrom(
        this.httpService
          .post(url, { email, subject, message })
          .pipe(map((response: any) => response.data)),
      );
    } catch (err) {
      console.error(err.response);
    }
  }
}
