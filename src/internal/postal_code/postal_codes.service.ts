import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PostalCodes } from 'src/database/entities/postal_codes.entity';
import { MessageService } from 'src/message/message.service';
import { RMessage } from 'src/response/response.interface';
import { ResponseService } from 'src/response/response.service';
import { Repository } from 'typeorm';

@Injectable()
export class InternalPostalCodesService {
  constructor(
    @InjectRepository(PostalCodes)
    private postalCodesRepository: Repository<PostalCodes>,
    private readonly responseService: ResponseService,
    private readonly messageService: MessageService,
  ) {}

  async getPostalCodesDetailByPostalCode(postal_code: string) {
    return await this.postalCodesRepository.findOne({
      where: { postal_code: postal_code },
    });
  }

  async getPostalCodesDetailToCountryByPostalCode(postal_code: string) {
    try {
      return await this.postalCodesRepository.findOne({
        where: {
          postal_code,
        },
        relations: ['city', 'city.province', 'city.province.country'],
      });
    } catch (error) {
      const errors: RMessage = {
        value: '',
        property: '',
        constraint: [this.messageService.get('address.general.fail')],
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
}
