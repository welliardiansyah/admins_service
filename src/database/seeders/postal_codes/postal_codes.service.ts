import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PostalCodes } from 'src/database/entities/postal_codes.entity';
import { IPostalCodes } from 'src/database/interfaces/postal_codes.interface';
import { Repository } from 'typeorm';
import { postal_codes } from './postal_codes.data';

@Injectable()
export class PostalCodesSeederService {
  constructor(
    @InjectRepository(PostalCodes)
    private readonly postalCodeRepository: Repository<PostalCodes>,
  ) {}
  async create(): Promise<Array<Promise<PostalCodes>>> {
    const postal_code_in_db = await this.postalCodeRepository
      .createQueryBuilder('mu')
      .whereInIds([postal_codes[1], postal_codes[10], postal_codes[100]])
      .getMany();
    if (postal_code_in_db.length > 0) {
      Logger.warn('Data postal code sudah pernah di migrasi.');
      return [Promise.resolve(null)];
    }

    return postal_codes.map(async (postal_code: IPostalCodes) => {
      return this.postalCodeRepository
        .findOne({ where: { id: postal_code.id } })
        .then(async (findOne) => {
          if (findOne) {
            return Promise.resolve(null);
          }
          const create_postal_code =
            this.postalCodeRepository.create(postal_code);
          return this.postalCodeRepository.save(create_postal_code);
        })
        .catch((error) => Promise.reject(error));
    });
  }
}
