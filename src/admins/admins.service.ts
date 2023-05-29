import {
  BadRequestException,
  HttpStatus,
  Injectable,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AdminsDocument } from 'src/database/entities/admins.entity';
import { MessageService } from 'src/message/message.service';
import { ResponseService } from 'src/response/response.service';
import { IsNull, Not, Repository } from 'typeorm';
import { compare, genSaltSync, hash } from 'bcrypt';
import { catchError, map, Observable } from 'rxjs';
import { AxiosResponse } from 'axios';
import {
  BaseQueryFilterDto,
  CreateAdminUserDto,
  UbahEmailDto,
  UpdateEmailDto,
  UpdatePasswordDto,
  UpdatePhoneDto,
  UpdateProfileDto,
  VerifikasiUbahEmailDto,
  VerifikasiUbahPhoneDto,
} from './validation/admins-users.dto';
import {
  IListResponse,
  RMessage,
  RSuccessMessage,
} from 'src/response/response.interface';
import { deleteCredParam } from 'src/common/general-utils';
import {
  formatingAllOutputTime,
  removeAllFieldPassword,
} from 'src/utils/general.utils';
import { randomUUID } from 'crypto';
import { HashService } from 'src/hash/hash.service';
import { HttpService } from '@nestjs/axios';
import { generateEmailUrlVerification } from 'src/utils/general-utils';

@Injectable()
export class AdminsService {
  private LOG_CONTEXT = 'AdminService';

  constructor(
    @InjectRepository(AdminsDocument)
    private readonly adminRepository: Repository<AdminsDocument>,
    private httpService: HttpService,
    private readonly messageService: MessageService,
    private readonly responseService: ResponseService,
    // @Hash()
    private readonly hashService: HashService,
  ) {}

  async checkAdminRoleIsActive(role_id: string): Promise<number> {
    return this.adminRepository.count({
      where: [{ role_id: role_id }, { deleted_at: Not(IsNull()) }],
    });
  }

  async findOneAdminByEmail(email: string): Promise<AdminsDocument> {
    return this.adminRepository.findOne({ where: { email: email } });
  }

  async findOneAdminByPhone(phone: string): Promise<AdminsDocument> {
    return this.adminRepository.findOne({ where: { phone: phone } });
  }

  async findOneById(id: string): Promise<AdminsDocument> {
    return this.adminRepository.findOne({ where: { id: id } });
  }

  async validatePassword(
    passwordString: string,
    passwordHash: string,
  ): Promise<boolean> {
    return this.bcryptComparePassword(passwordString, passwordHash);
  }

  async bcryptComparePassword(
    passwordString: string,
    passwordHashed: string,
  ): Promise<boolean> {
    return compare(passwordString, passwordHashed);
  }

  private randomSalt(): string {
    Logger.log(
      `ENV HASH PASSWORD SALT :${process.env.HASH_PASSWORDSALTLENGTH}`,
    );
    const defaultSalt: number =
      Number(process.env.HASH_PASSWORDSALTLENGTH) || 10;
    return genSaltSync(defaultSalt);
  }

  async generateHashPassword(password: string): Promise<string> {
    const defaultSalt: number =
      Number(process.env.HASH_PASSWORDSALTLENGTH) || 10;
    const salt = genSaltSync(defaultSalt);

    return hash(password, salt);
  }

  async postHttp(
    url: string,
    body: Record<string, any>,
    headers: Record<string, any>,
  ): Promise<Observable<AxiosResponse<any>>> {
    return this.httpService.post(url, body, { headers: headers }).pipe(
      map((response) => response.data),
      catchError((err) => {
        throw err;
      }),
    );
  }

  async updateApp(id: any, apps_id: any) {
    try {
      const updateApps = await this.adminRepository
        .createQueryBuilder()
        .update()
        .set({ apps_id: apps_id })
        .where('id = :id', { id: id })
        .execute();

      return this.responseService.success(
        true,
        'User added application successfully!.',
        updateApps,
      );
    } catch (e) {
      Logger.error(e.message, this.LOG_CONTEXT);
      throw e;
    }
  }

  async createNewAdmin(data: CreateAdminUserDto): Promise<AdminsDocument> {
    try {
      const newAdmin = new AdminsDocument({
        ...data,
        password: await this.generateHashPassword(data.password),
      });

      return this.adminRepository
        .save(newAdmin)
        .catch((e) => {
          Logger.error(e.message, '', 'Create Admin User');
          throw e;
        })
        .then((e) => {
          delete e.password;
          return e;
        });
    } catch (e) {
      Logger.error(e.message, this.LOG_CONTEXT);
      throw e;
    }
  }

  async deleteAdminUser(id: string): Promise<any> {
    try {
      return await this.adminRepository
        .softDelete({ id: id })
        .then((res) => {
          if (res.affected == 0)
            Logger.warn(`Soft Delete success, but did't change anything`);

          return res;
        })
        .catch((e) => {
          throw e;
        });
    } catch (e) {
      Logger.error(e.message, '', this.LOG_CONTEXT);
      throw e;
    }
  }

  async getListAdmins(filter: BaseQueryFilterDto): Promise<IListResponse> {
    try {
      const search = filter.search || '';
      const curPage = filter.page || 1;
      const perPage = filter.limit || 10;
      let skip = (curPage - 1) * perPage;
      skip = skip < 0 ? 0 : skip; //prevent negative on skip()

      const result = await this.adminRepository
        .createQueryBuilder('admins')
        .where(`${search ? `name LIKE :search` : ''}`, {
          search: `%${search}%`,
        })
        .skip(skip)
        .take(perPage)
        .getManyAndCount()
        .catch((e) => {
          throw e;
        });

      const [rows, totalRows] = result;

      const formatRows = rows.map((e) => {
        delete e.password;
        return { ...e };
      });

      const listItems: IListResponse = {
        current_page: curPage,
        total_item: totalRows,
        limit: perPage,
        items: formatRows,
      };

      return listItems;
    } catch (e) {
      Logger.error(e.message, '', this.LOG_CONTEXT);
      throw e;
    }
  }

  async updateDataAdmin(
    id: string,
    data: AdminsDocument,
  ): Promise<AdminsDocument> {
    try {
      const res = await this.adminRepository.update(id, data);
      if (res.affected == 0)
        Logger.warn(`Update success, but did't change anything`);

      return await this.adminRepository.findOne({ where: { id: data.id } });
    } catch (e) {
      Logger.error(e.message, '', this.LOG_CONTEXT);
      throw e;
    }
  }

  async getProfile(id: string): Promise<RSuccessMessage> {
    const profile = await this.adminRepository.findOne({
      where: { id: id },
    });
    if (!profile) {
      const errors: RMessage = {
        value: '',
        property: 'payload',
        constraint: [
          this.messageService.get('admins.general.unregistered_user'),
        ],
      };
      throw new BadRequestException(
        this.responseService.error(
          HttpStatus.BAD_REQUEST,
          errors,
          'Bad Request',
        ),
      );
    }
    deleteCredParam(profile);
    return this.responseService.success(
      true,
      this.messageService.get('admins.general.success'),
      profile,
    );
  }

  async updateProfile(data: UpdateProfileDto): Promise<AdminsDocument> {
    const admin = new AdminsDocument();
    admin.id = data.id;
    admin.name = data.name;
    admin.nip = data.nip;
    const result = await this.adminRepository.save(admin);
    if (result) {
      return this.adminRepository.findOne({ where: { id: result.id } });
    }
  }

  async updatePassword(data: UpdatePasswordDto): Promise<AdminsDocument> {
    const admin = new AdminsDocument();
    admin.id = data.id;
    admin.password = await this.generateHashPassword(data.new_password);
    const result = await this.adminRepository.save(admin);
    if (result) {
      return this.adminRepository.findOne({ where: { id: result.id } });
    }
  }

  async updateEmail(data: UpdateEmailDto): Promise<AdminsDocument> {
    const admin = new AdminsDocument();
    admin.id = data.id;
    admin.email = data.email;
    admin.email_verified_at = new Date();
    const result = await this.adminRepository.save(admin);
    if (result) {
      return this.adminRepository.findOne({ where: { id: result.id } });
    }
  }

  async updatePhone(data: UpdatePhoneDto): Promise<AdminsDocument> {
    const admin = new AdminsDocument();
    admin.id = data.id;
    admin.phone = data.phone;
    admin.phone_verified_at = new Date();
    const result = await this.adminRepository.save(admin);
    if (result) {
      return this.adminRepository.findOne({ where: { id: result.id } });
    }
  }

  async ubahEmail(
    data: UbahEmailDto,
    user: Record<string, any>,
  ): Promise<RSuccessMessage> {
    const existEmail = await this.findOneAdminByEmail(data.email);
    if (existEmail) {
      const errors: RMessage = {
        value: data.email,
        property: 'email',
        constraint: [this.messageService.get('admins.general.emailExist')],
      };
      throw new BadRequestException(
        this.responseService.error(
          HttpStatus.BAD_REQUEST,
          errors,
          'Bad Request',
        ),
      );
    }
    const userAccount = await this.adminRepository.findOne(user.id);
    if (!userAccount) {
      throw new BadRequestException(
        this.responseService.error(
          HttpStatus.BAD_REQUEST,
          {
            value: user.id,
            property: 'id',
            constraint: [this.messageService.get('admins.general.idNotFound')],
          },
          'Bad Request',
        ),
      );
    }

    userAccount.email = data.email;
    userAccount.email_verified_at = null;
    const token = randomUUID();
    userAccount.token_reset_password = token;

    try {
      const result: Record<string, any> = await this.adminRepository.save(
        userAccount,
      );
      result.password = undefined;

      const urlVerification = `${process.env.BASEURL_SUPERADMIN}/auth/email-verification?t=${token}`;
      const messageUrlVerifivation = await generateEmailUrlVerification(
        userAccount.name,
        urlVerification,
      );

      if (process.env.NODE_ENV == 'test') {
        result.token_reset_password = token;
        result.url = urlVerification;
      }
      // this.notificationService.sendEmail(
      //   data.email,
      //   'Verifikasi Email baru',
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
      removeAllFieldPassword(result);
      formatingAllOutputTime(result);

      const urlVerification = `${process.env.BASEURL_SUPERADMIN}/auth/email-verification?t=${token}`;
      const messageUrlVerifivation = await generateEmailUrlVerification(
        userAccount.name,
        urlVerification,
      );

      if (process.env.NODE_ENV == 'test') {
        result.token_reset_password = token;
        result.url = urlVerification;
      }
      // this.notificationService.sendEmail(
      //   userAccount.email,
      //   'Verifikasi Ulang Email',
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

  async verifikasiUbahEmail(
    data: VerifikasiUbahEmailDto,
  ): Promise<RSuccessMessage> {
    const cekToken = await this.adminRepository
      .findOne({ where: { token_reset_password: data.token } })
      .catch(() => {
        throw new BadRequestException(
          this.responseService.error(
            HttpStatus.BAD_REQUEST,
            {
              value: data.token,
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
            value: data.token,
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
            value: data.token,
            property: 'token',
            constraint: [
              this.messageService.get('admins.general.dataNotFound'),
            ],
          },
          'Bad Request',
        ),
      );
    }

    cekToken.email_verified_at = new Date();
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

  async verifikasiUbahTelepon(
    args: Partial<VerifikasiUbahPhoneDto>,
  ): Promise<any> {
    const cekToken = await this.adminRepository
      .findOne({
        where: { token_reset_password: args.token },
      })
      .catch(() => {
        throw new BadRequestException(
          this.responseService.error(
            HttpStatus.BAD_REQUEST,
            {
              value: args.token,
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
            value: args.token,
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
            value: args.token,
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
    cekToken.phone_verified_at = new Date();

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
