import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { randomUUID } from 'crypto';
import { CommonService } from 'src/common/common.service';
import { EmailsService } from 'src/common/emails/emails.service';
// import { Hash } from 'src/hash/hash.decorator';
import { AdminsDocument } from 'src/database/entities/admins.entity';
import { HashService } from 'src/hash/hash.service';
import { MessageService } from 'src/message/message.service';
import { RMessage } from 'src/response/response.interface';
import { ResponseService } from 'src/response/response.service';
import {
  generateMessageResetPassword,
  generateSmsResetPassword,
} from 'src/utils/general-utils';
import { Repository } from 'typeorm';
import { UpdateAdminUserDto } from './validation/admins-users.dto';

@Injectable()
export class ResetPasswordService {
  constructor(
    private readonly responseService: ResponseService,
    private readonly messageService: MessageService,
    @InjectRepository(AdminsDocument)
    private readonly adminRepository: Repository<AdminsDocument>,
    private readonly commonService: CommonService,
    private readonly emailService: EmailsService,
    // @Hash()
    private readonly hashService: HashService,
  ) {}

  async resetPasswordEmail(args: Partial<UpdateAdminUserDto>): Promise<any> {
    const cekEmail = await this.adminRepository
      .findOne({
        where: { email: args.email },
      })
      .catch(() => {
        throw new BadRequestException(
          this.responseService.error(
            HttpStatus.BAD_REQUEST,
            {
              value: args.email,
              property: 'email',
              constraint: [
                this.messageService.get('admins.general.emailNotFound'),
              ],
            },
            'Bad Request',
          ),
        );
      });

    if (!cekEmail) {
      throw new BadRequestException(
        this.responseService.error(
          HttpStatus.BAD_REQUEST,
          {
            value: args.email,
            property: 'email',
            constraint: [
              this.messageService.get('admins.general.emailNotFound'),
            ],
          },
          'Bad Request',
        ),
      );
    }

    //Generate Random String
    const token = randomUUID();
    cekEmail.token_reset_password = token;

    try {
      await this.adminRepository.save(cekEmail);

      // const url = `${process.env.BASEURL_SUPERADMIN}/auth/create-password?t=${token}`;
      // const messageResetPassword = await generateMessageResetPassword(
      //   cekEmail.name,
      //   url,
      // );

      // biarkan tanpa await karena dilakukan secara asynchronous
      // this.notificationService.sendEmail(
      //   cekEmail.email,
      //   'Reset Password',
      //   '',
      //   messageResetPassword,
      // );

      // if (cekEmail.email) {
      //   this.emailService.sendEmail(cekEmail.email);
      // }

      const response: Record<string, any> = {
        status: true,
      };

      if (process.env.NODE_ENV == 'test') {
        response.token = token;
        // response.url = url;
      }
      return response;
    } catch (err) {
      const errors: RMessage = {
        value: '',
        property: err.column,
        constraint: [err.message],
      };
      throw new BadRequestException(
        this.responseService.error(
          HttpStatus.BAD_REQUEST,
          errors,
          'Bad Request',
        ),
      );
    }
  }

  async resetPasswordPhone(args: Partial<UpdateAdminUserDto>): Promise<any> {
    const cekPhone = await this.adminRepository
      .findOne({
        where: { phone: args.phone },
      })
      .catch(() => {
        throw new BadRequestException(
          this.responseService.error(
            HttpStatus.BAD_REQUEST,
            {
              value: args.phone,
              property: 'phone',
              constraint: [
                this.messageService.get('admins.general.phoneNotFound'),
              ],
            },
            'Bad Request',
          ),
        );
      });
    if (!cekPhone) {
      throw new BadRequestException(
        this.responseService.error(
          HttpStatus.BAD_REQUEST,
          {
            value: args.phone,
            property: 'phone',
            constraint: [
              this.messageService.get('admins.general.phoneNotFound'),
            ],
          },
          'Bad Request',
        ),
      );
    }

    //Generate Random String
    const token = randomUUID();
    cekPhone.token_reset_password = token;

    try {
      await this.adminRepository.save(cekPhone);

      const url = `${process.env.BASEURL_SUPERADMIN}/auth/create-password?t=${token}`;
      const smsMessage = await generateSmsResetPassword(cekPhone.name, url);
      // this.notificationService.sendSms(cekPhone.phone, smsMessage);

      const response: Record<string, any> = {
        status: true,
      };

      if (process.env.NODE_ENV == 'test') {
        response.token = token;
        response.url = url;
      }
      return response;
    } catch (err) {
      const errors: RMessage = {
        value: '',
        property: err.column,
        constraint: [err.message],
      };
      throw new BadRequestException(
        this.responseService.error(
          HttpStatus.BAD_REQUEST,
          errors,
          'Bad Request',
        ),
      );
    }
  }

  async resetPasswordExec(
    args: Partial<UpdateAdminUserDto>,
    qstring: Record<string, any>,
  ): Promise<any> {
    const cekToken = await this.adminRepository
      .findOne({
        where: { token_reset_password: qstring.token },
      })
      .catch(() => {
        throw new BadRequestException(
          this.responseService.error(
            HttpStatus.BAD_REQUEST,
            {
              value: qstring.token,
              property: 'token',
              constraint: [
                this.messageService.get('admins.general.dataNotFound'),
              ],
            },
            'Bad Request',
          ),
        );
      });
    if (!cekToken) {
      throw new BadRequestException(
        this.responseService.error(
          HttpStatus.BAD_REQUEST,
          {
            value: qstring.token,
            property: 'token',
            constraint: [
              this.messageService.get('admins.general.dataNotFound'),
            ],
          },
          'Bad Request',
        ),
      );
    }

    if (cekToken.token_reset_password == null) {
      throw new BadRequestException(
        this.responseService.error(
          HttpStatus.BAD_REQUEST,
          {
            value: qstring.token,
            property: 'token',
            constraint: [
              this.messageService.get('admins.general.dataNotFound'),
            ],
          },
          'Bad Request',
        ),
      );
    }

    const salt: string = await this.hashService.randomSalt();
    const passwordHash = await this.hashService.hashPassword(
      args.password,
      salt,
    );
    cekToken.password = passwordHash;
    cekToken.token_reset_password = null;

    return this.adminRepository
      .save(cekToken)
      .then(() => {
        return this.responseService.success(
          true,
          this.messageService.get('admins.general.success'),
        );
      })
      .catch((err) => {
        const errors: RMessage = {
          value: '',
          property: err.column,
          constraint: [err.message],
        };
        throw new BadRequestException(
          this.responseService.error(
            HttpStatus.BAD_REQUEST,
            errors,
            'Bad Request',
          ),
        );
      });
  }
}
