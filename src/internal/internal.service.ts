import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PostalCodes } from 'src/database/entities/postal_codes.entity';
import { Repository } from 'typeorm';

@Injectable()
export class InternalService {
  constructor(
    @InjectRepository(PostalCodes)
    private postalCodesRepository: Repository<PostalCodes>,
  ) {}

  async getPostalCodesDetailByPostalCode(
    postal_code: string,
  ): Promise<PostalCodes> {
    return await this.postalCodesRepository.findOne({
      where: { postal_code: postal_code },
    });
  }
}
