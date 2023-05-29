import {
  BadRequestException,
  ConflictException,
  HttpStatus,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { genSaltSync, hash } from 'bcrypt';
import { randomUUID } from 'crypto';
import _ from 'lodash';
import { User } from 'src/auth/guard/interface/user.interface';
import { RoleService } from 'src/common/auth/role.service';
import { CommonService } from 'src/common/common.service';
import { EmailsService } from 'src/common/emails/emails.service';
import { SmsService } from 'src/common/sms/sms.service';
import { AdminsDocument } from 'src/database/entities/admins.entity';
import { MessageService } from 'src/message/message.service';
import {
  IListResponse,
  RSuccessMessage,
} from 'src/response/response.interface';
import { ResponseService } from 'src/response/response.service';
import {
  generateEmailUrlVerification,
  generateMessageChangeActiveEmail,
  generateSmsResetPassword,
} from 'src/utils/general-utils';
import {
  formatingAllOutputTime,
  removeAllFieldPassword,
} from 'src/utils/general.utils';
import { Repository } from 'typeorm';
import {
  CreateAdminUserDto,
  ListAdminUserDTO,
  UpdateAdminUserDto,
} from './validation/admins-users.dto';
import { UpdateEmailUserValidation } from './validation/update_email_user.validation.dto';
import { UpdatePhoneUserValidation } from './validation/update_phone_user.validation.dto';

@Injectable()
export class AdminsUsersService {
  private LOG_CONTEXT = 'AdminService';

  constructor(
    @InjectRepository(AdminsDocument)
    private readonly adminRepository: Repository<AdminsDocument>,
    private readonly messageService: MessageService,
    private readonly responseService: ResponseService,
    private readonly commonService: CommonService,
    private readonly roleService: RoleService,
    private readonly emailService: EmailsService,
    private readonly smsService: SmsService,
  ) {}

  async generateHashPassword(password: string): Promise<string> {
    const defaultSalt: number =
      Number(process.env.HASH_PASSWORDSALTLENGTH) || 10;
    const salt = genSaltSync(defaultSalt);

    return hash(password, salt);
  }

  async updateDataAdmin(
    id: string,
    data: AdminsDocument,
  ): Promise<AdminsDocument> {
    try {
      const res = await this.adminRepository.update(id, data);
      if (res.affected == 0)
        Logger.warn(`Update success, but did't change anything`);

      return await this.adminRepository.findOne({
        where: { id: data.id },
      });
    } catch (e) {
      Logger.error(e.message, '', this.LOG_CONTEXT);
      throw e;
    }
  }

  async createNewAdminUser(data: CreateAdminUserDto): Promise<RSuccessMessage> {
    const isExists = await this.adminRepository.findOne({
      where: { email: data.email },
    });
    if (isExists) {
      throw new ConflictException(
        this.responseService.error(
          HttpStatus.CONFLICT,
          {
            value: data.email,
            property: 'email',
            constraint: ['email yang anda pakai sudah terdaftar!'],
          },
          'User Already Exists',
        ),
      );
    }

    const isPhoneExists = await this.adminRepository.findOne({
      where: { phone: data.phone },
    });
    if (isPhoneExists) {
      throw new ConflictException(
        this.responseService.error(
          HttpStatus.CONFLICT,
          {
            value: data.phone,
            property: 'phone',
            constraint: ['Nomer telepon yang anda pakai sudah terdaftar!'],
          },
          'User Already Exists',
        ),
      );
    }

    await this.roleService.roleValidation(data.role_id, 'SUPERADMIN');

    const token = randomUUID();
    try {
      const newAdmin = new AdminsDocument({
        ...data,
        password: await this.generateHashPassword(data.password),
        token_reset_password: token,
      });

      const result: Record<string, any> = await this.adminRepository.save(
        newAdmin,
      );

      result.password = undefined;

      const urlVerification = `${process.env.BASEURL_SUPERADMIN}/auth/phone-verification?t=${token}`;

      if (process.env.NODE_ENV == 'test') {
        result.token_reset_password = token;
        result.url = urlVerification;
      }

      const emailMessage = await generateEmailUrlVerification(
        result.name,
        urlVerification,
      );

      this.emailService.sendEmail(
        result.email,
        'Verification Email',
        emailMessage,
      );

      return this.responseService.success(
        true,
        'Success Create new admin!',
        newAdmin,
      );
    } catch (e) {
      Logger.error(e.message, this.LOG_CONTEXT);
      throw e;
    }
  }

  async updateAdminUser(data: UpdateAdminUserDto): Promise<RSuccessMessage> {
    const isExists = await this.adminRepository
      .findOne({
        where: { id: data.id },
      })
      .catch((e) => {
        Logger.error(e.message, '', this.LOG_CONTEXT);
        throw e;
      });

    if (!isExists) {
      throw new NotFoundException(
        this.responseService.error(
          HttpStatus.NOT_FOUND,
          {
            constraint: ['Admin user dengan id tersebut TIDAK ada!'],
            value: data.id,
            property: 'user_id',
          },
          'Not Found Exception',
        ),
      );
    }

    if (data.email) {
      const isEmailExists = await this.adminRepository.findOne({
        where: { email: data.email },
      });
      if (isEmailExists && isEmailExists.email != isExists.email) {
        throw new ConflictException(
          this.responseService.error(
            HttpStatus.CONFLICT,
            {
              value: data.email,
              property: 'email',
              constraint: ['email yang anda pakai sudah terdaftar!'],
            },
            'User Already Exists',
          ),
        );
      }
    }

    if (data.phone) {
      const isPhoneExists = await this.adminRepository.findOne({
        where: { phone: data.phone },
      });
      if (isPhoneExists && isPhoneExists.phone != isExists.phone) {
        throw new ConflictException(
          this.responseService.error(
            HttpStatus.CONFLICT,
            {
              value: data.phone,
              property: 'phone',
              constraint: ['Nomer telepon yang anda pakai sudah terdaftar!'],
            },
            'User Already Exists',
          ),
        );
      }
    }

    if (data.role_id) {
      await this.roleService.roleValidation(data.role_id, 'SUPERADMIN');
    }

    // check if payload has update password proceed to update with new password hash;
    let hashpassword = '';
    if (data.password) {
      hashpassword = await this.generateHashPassword(data.password);
    }
    const newUpdated = Object.assign(isExists, {
      ...data,
      password: data.password ? hashpassword : isExists.password,
    });

    const result = await this.updateDataAdmin(data.id, newUpdated);
    removeAllFieldPassword(result);
    formatingAllOutputTime(result);

    return this.responseService.success(
      true,
      `Success Update user admin detail`,
      [result],
    );
  }

  async deleteAdminUser(user: User, id: string): Promise<any> {
    const isExists = await this.adminRepository
      .findOne({
        where: { id: id },
      })
      .catch((e) => {
        Logger.error(e.message, '', this.LOG_CONTEXT);
        throw e;
      });

    if (!isExists) {
      throw new NotFoundException(
        this.responseService.error(
          HttpStatus.NOT_FOUND,
          {
            constraint: ['Admin user dengan id tersebut TIDAK ada!'],
            value: id,
            property: 'user_id',
          },
          'Not Found Exception',
        ),
      );
    }

    if (isExists.id === user.id) {
      throw new BadRequestException(
        this.responseService.error(
          HttpStatus.BAD_REQUEST,
          {
            constraint: [
              this.messageService.get('admins.general.cannotDeleteOwnUser'),
            ],
            value: id,
            property: 'user_id',
          },
          'Bad Request',
        ),
      );
    }

    try {
      return await this.adminRepository
        .softDelete({ id: id })
        .then((res) => {
          if (res.affected == 0)
            Logger.warn(`Soft Delete success, but did't change anything`);

          return this.responseService.success(
            true,
            `Success Soft Delete user admin!`,
            [
              {
                user_id: id,
              },
            ],
          );
        })
        .catch((e) => {
          throw e;
        });
    } catch (e) {
      Logger.error(e.message, '', this.LOG_CONTEXT);
      throw e;
    }
  }

  async getListAdmins(filter: ListAdminUserDTO): Promise<IListResponse> {
    try {
      const search = filter.search || '';
      const curPage = filter.page || 1;
      const perPage = filter.limit || 10;
      let skip = (curPage - 1) * perPage;
      skip = skip < 0 ? 0 : skip; //prevent negative on skip()

      const query = this.adminRepository
        .createQueryBuilder('admins')
        .where('admins.name ILIKE :search ', {
          search: `%${search}%`,
        });

      if (filter.statuses) {
        query.andWhere('admins.status IN (:...statuses)', {
          statuses: filter.statuses,
        });
      }

      if (filter.role_id) {
        query.andWhere('admins.role_id = :role_id', {
          role_id: filter.role_id,
        });
      }
      const result = await query.skip(skip).take(perPage).getManyAndCount();

      const [rows, totalRows] = result;

      const listItems: IListResponse = {
        current_page: curPage,
        total_item: totalRows,
        limit: perPage,
        items: rows,
      };

      return listItems;
    } catch (e) {
      Logger.error(e.message, '', this.LOG_CONTEXT);
      throw e;
    }
  }

  async getAdminDetail(id: string): Promise<any> {
    try {
      const user = await this.adminRepository
        .findOne({
          where: { id: id },
        })
        .catch((e) => {
          Logger.error(e.message, '', this.LOG_CONTEXT);

          if (e.message?.includes('invalid input')) {
            throw new BadRequestException(
              this.responseService.error(
                HttpStatus.BAD_REQUEST,
                {
                  value: id,
                  property: 'user_id',
                  constraint: [
                    this.messageService.get('admins.general.invalidUUID'),
                  ],
                },
                'Bad Request',
              ),
            );
          }

          throw e;
        });

      if (!user) {
        throw new NotFoundException(
          this.responseService.error(
            HttpStatus.NOT_FOUND,
            {
              constraint: [
                this.messageService.get('admins.general.dataNotFound'),
              ],
              value: id,
              property: 'user_id',
            },
            'Not Found Exception',
          ),
        );
      }

      removeAllFieldPassword(user);
      formatingAllOutputTime(user);

      const role = await this.roleService.getRole([user.role_id]);
      user.role_name = role[0]?.name ? role[0].name : null;

      return this.responseService.success(
        true,
        `Success user admin detail`,
        user,
      );
    } catch (e) {
      Logger.error(e.message, '', this.LOG_CONTEXT);
      throw e;
    }
  }

  async updatePhoneUser(
    args: UpdatePhoneUserValidation,
    user_id: string,
  ): Promise<any> {
    const adminUser = await this.adminRepository.findOne({
      where: { id: user_id },
    });
    if (!adminUser) {
      throw new BadRequestException(
        this.responseService.error(
          HttpStatus.BAD_REQUEST,
          {
            value: user_id,
            property: 'user_id',
            constraint: [
              this.messageService.get('admins.general.unregistered_user'),
            ],
          },
          'Bad Request',
        ),
      );
    }

    const cekPhone = await this.adminRepository.findOne({
      where: { phone: args.phone },
    });
    if (cekPhone && cekPhone.phone != adminUser.phone) {
      throw new BadRequestException(
        this.responseService.error(
          HttpStatus.BAD_REQUEST,
          {
            value: args.phone,
            property: 'phone',
            constraint: [this.messageService.get('admins.general.phoneExist')],
          },
          'Bad Request',
        ),
      );
    }
    adminUser.phone = args.phone;

    try {
      const result = await this.adminRepository.save(adminUser);
      result.password = undefined;

      // this.notificationService.sendSms(
      //   args.phone,
      //   generateSmsChangeActiveNoHp(adminUser.name),
      // );

      return this.responseService.success(
        true,
        this.messageService.get('admins.general.success'),
        result,
      );
    } catch (err) {
      console.error('catch error: ', err);
      throw new BadRequestException(
        this.responseService.error(
          HttpStatus.BAD_REQUEST,
          {
            value: '',
            property: err.column,
            constraint: [err.message],
          },
          'Bad Request',
        ),
      );
    }
  }

  async updateEmailUser(
    args: UpdateEmailUserValidation,
    user_id: string,
  ): Promise<any> {
    const adminUser = await this.adminRepository.findOne({
      where: { id: user_id },
    });
    if (!adminUser) {
      throw new BadRequestException(
        this.responseService.error(
          HttpStatus.BAD_REQUEST,
          {
            value: user_id,
            property: 'user_id',
            constraint: [
              this.messageService.get('admins.general.unregistered_user'),
            ],
          },
          'Bad Request',
        ),
      );
    }

    const cekEmail = await this.adminRepository.findOne({
      where: { email: args.email },
    });
    if (cekEmail && cekEmail.email != adminUser.email) {
      throw new BadRequestException(
        this.responseService.error(
          HttpStatus.BAD_REQUEST,
          {
            value: args.email,
            property: 'email',
            constraint: [this.messageService.get('admins.general.emailExist')],
          },
          'Bad Request',
        ),
      );
    }
    adminUser.email = args.email;
    const token = randomUUID();
    adminUser.token_reset_password = token;

    try {
      const result = await this.adminRepository.save(adminUser);
      result.password = undefined;

      const messageUrlVerifivation = generateMessageChangeActiveEmail(
        adminUser.name,
      );

      // this.notificationService.sendEmail(
      //   args.email,
      //   'Email Anda telah diperbarui',
      //   '',
      //   messageUrlVerifivation,
      // );

      return this.responseService.success(
        true,
        this.messageService.get('admins.general.success'),
        result,
      );
    } catch (err) {
      console.error('catch error: ', err);
      throw new BadRequestException(
        this.responseService.error(
          HttpStatus.BAD_REQUEST,
          {
            value: '',
            property: err.column,
            constraint: [err.message],
          },
          'Bad Request',
        ),
      );
    }
  }

  async updatePasswordUser(user_id: string): Promise<any> {
    const adminUser = await this.adminRepository.findOne({
      where: { id: user_id },
    });
    if (!adminUser) {
      throw new BadRequestException(
        this.responseService.error(
          HttpStatus.BAD_REQUEST,
          {
            value: user_id,
            property: 'user_id',
            constraint: [
              this.messageService.get('admins.general.unregistered_user'),
            ],
          },
          'Bad Request',
        ),
      );
    }

    const token = randomUUID();
    adminUser.token_reset_password = token;

    try {
      const result: Record<string, any> = await this.adminRepository.save(
        adminUser,
      );
      result.password = undefined;

      const urlVerification = `${process.env.BASEURL_SUPERADMIN}/auth/create-password?t=${token}`;
      if (process.env.NODE_ENV == 'test') {
        result.token_reset_password = token;
        result.url = urlVerification;
      }
      const smsMessage = await generateSmsResetPassword(
        adminUser.name,
        urlVerification,
      );

      // this.notificationService.sendSms(adminUser.phone, smsMessage);

      return this.responseService.success(
        true,
        this.messageService.get('admins.general.success'),
        result,
      );
    } catch (err) {
      console.error('catch error: ', err);
      throw new BadRequestException(
        this.responseService.error(
          HttpStatus.BAD_REQUEST,
          {
            value: '',
            property: err.column,
            constraint: [err.message],
          },
          'Bad Request',
        ),
      );
    }
  }

  async resendEmailUser(user_id: string): Promise<RSuccessMessage> {
    const userAccount = await this.adminRepository.findOne({
      where: { id: user_id },
    });
    if (!userAccount) {
      throw new BadRequestException(
        this.responseService.error(
          HttpStatus.BAD_REQUEST,
          {
            value: user_id,
            property: 'user_id',
            constraint: [this.messageService.get('admins.general.idNotFound')],
          },
          'Bad Request',
        ),
      );
    }

    userAccount.email_verified_at = null;
    const token = randomUUID();
    userAccount.token_reset_password = token;

    try {
      const result: Record<string, any> = await this.adminRepository.save(
        userAccount,
      );

      result.password = undefined;
      result.token_reset_password = undefined;
      result.refresh_token = undefined;

      const urlVerification = `${process.env.BASEURL_ZEUS}/auth/email-verification?t=${token}`;
      const messageUrlVerifivation = await generateEmailUrlVerification(
        userAccount.name,
        urlVerification,
      );
      if (process.env.NODE_ENV == 'test') {
        result.token_reset_password = token;
        result.url = urlVerification;
      }

      this.emailService.sendEmail(
        result.email,
        'Resend Email Verification',
        messageUrlVerifivation,
      );

      return this.responseService.success(
        true,
        this.messageService.get('admins.general.success'),
        result,
      );
    } catch (err) {
      console.error('catch error: ', err);
      throw new BadRequestException(
        this.responseService.error(
          HttpStatus.BAD_REQUEST,
          {
            value: '',
            property: err.column,
            constraint: [err.message],
          },
          'Bad Request',
        ),
      );
    }
  }

  async resendPhoneUser(user_id: string): Promise<RSuccessMessage> {
    const userAccount = await this.adminRepository.findOne({
      where: { id: user_id },
    });

    if (!userAccount) {
      throw new BadRequestException(
        this.responseService.error(
          HttpStatus.BAD_REQUEST,
          {
            value: user_id,
            property: 'user_id',
            constraint: [this.messageService.get('admins.general.idNotFound')],
          },
          'Bad Request',
        ),
      );
    }

    userAccount.phone_verified_at = null;
    const token = randomUUID();
    userAccount.token_reset_password = token;

    try {
      const result: Record<string, any> = await this.adminRepository.save(
        userAccount,
      );
      result.password = undefined;

      return this.responseService.success(
        true,
        this.messageService.get('admins.general.success'),
        result,
      );
    } catch (err) {
      console.error('catch error: ', err);
      throw new BadRequestException(
        this.responseService.error(
          HttpStatus.BAD_REQUEST,
          {
            value: '',
            property: err.column,
            constraint: [err.message],
          },
          'Bad Request',
        ),
      );
    }
  }
}
