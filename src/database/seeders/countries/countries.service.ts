import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Countries } from 'src/database/entities/countries.entity';
import { ICountries } from 'src/database/interfaces/countries.interface';
import { Repository } from 'typeorm';
import { countries } from './countries.data';

/**
 * Service dealing with country based operations.
 *
 * @class
 */
@Injectable()
export class CountriesSeederService {
  constructor(
    @InjectRepository(Countries)
    private readonly countryRepository: Repository<Countries>,
  ) {}
  create(): Array<Promise<Countries>> {
    return countries.map(async (country: ICountries) => {
      return await this.countryRepository
        .findOne({ where: { id: country.id } })
        .then(async (findOne) => {
          if (findOne) {
            return Promise.resolve(null);
          }
          const create_country = this.countryRepository.create(country);
          return await this.countryRepository.save(create_country);
        })
        .catch((error) => Promise.reject(error));
    });
  }
}
