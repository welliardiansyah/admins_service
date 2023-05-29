import { HttpService } from '@nestjs/axios';
import {
  BadRequestException,
  HttpStatus,
  Injectable,
  Logger,
} from '@nestjs/common';
import { AxiosResponse } from 'axios';
import { catchError, lastValueFrom, map } from 'rxjs';
import { CommonService } from 'src/common/common.service';
import { MessageService } from 'src/message/message.service';
import { RMessage } from 'src/response/response.interface';
import { ResponseService } from 'src/response/response.service';
import { RoleResponseDTO } from './dto/role-response.dto';
import { RoleDTO } from './dto/role.dto';

@Injectable()
export class RoleService {
  constructor(
    private readonly httpService: HttpService,
    private readonly messageService: MessageService,
    private readonly responseService: ResponseService,
    private readonly commonService: CommonService,
  ) {}

  logger = new Logger();

  async getRole(role_ids: string[]): Promise<RoleDTO[]> {
    if (!role_ids) {
      return null;
    }
    const headerRequest = {
      'Content-Type': 'application/json',
    };
    try {
      const url = `${process.env.BASEURL_AUTH_SERVICE}/api/v1/auth/roles/batchs`;
      const post_request = this.httpService
        .post(url, role_ids, { headers: headerRequest })
        .pipe(
          map((axiosResponse: AxiosResponse) => {
            return axiosResponse.data;
          }),
          catchError((err) => {
            this.logger.error(err);
            throw err;
          }),
        );
      const response_role: RoleResponseDTO = await lastValueFrom(post_request);
      if (!response_role) {
        const error_message: RMessage = {
          value: role_ids.join(),
          property: 'role_ids',
          constraint: [this.messageService.get('common.role.not_found')],
        };
        throw new BadRequestException(
          this.responseService.error(
            HttpStatus.BAD_REQUEST,
            error_message,
            'Bad Request',
          ),
        );
      }
      return response_role.data;
    } catch (error) {
      throw new BadRequestException(error.response.data);
    }
  }

  async getAndValodateRoleByRoleId(role_id: string): Promise<RoleDTO> {
    try {
      const roles = await this.getRole([role_id]);
      if (!roles) {
        throw new BadRequestException(
          this.responseService.error(
            HttpStatus.BAD_REQUEST,
            {
              value: role_id,
              property: 'role_id',
              constraint: [this.messageService.get('common.role.not_found')],
            },
            'Bad Request',
          ),
        );
      }
      return roles[0];
    } catch (error) {
      throw new BadRequestException(error.response.data);
    }
  }

  async roleValidation(
    role_id: string,
    platform: string,
  ): Promise<Record<string, any>> {
    try {
      const url = `${process.env.BASEURL_AUTH_SERVICE}/api/v1/auth/roles/${role_id}`;
      const role = await this.commonService.getHttp(url);

      if (!role || (role && !role.data)) {
        throw new BadRequestException(
          this.responseService.error(
            HttpStatus.BAD_REQUEST,
            {
              value: role_id,
              property: 'role_id',
              constraint: [
                this.messageService.get('admins.general.idNotFound'),
              ],
            },
            'Bad Request',
          ),
        );
      }

      if (role.data.platform != platform) {
        throw new BadRequestException(
          this.responseService.error(
            HttpStatus.BAD_REQUEST,
            {
              value: role_id,
              property: 'role_id',
              constraint: [
                this.messageService.get('admins.general.rolePlatformNotMatch'),
              ],
            },
            'Bad Request',
          ),
        );
      }
      return role;
    } catch (error) {
      throw error;
    }
  }
}
