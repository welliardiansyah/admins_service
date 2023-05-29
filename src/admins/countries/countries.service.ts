import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseQueryFilterDto } from 'src/admins/validation/admins-users.dto';
import { Countries } from 'src/database/entities/countries.entity';
import { IListResponse } from 'src/response/response.interface';
import { Repository } from 'typeorm';
import { CountriesDto } from './types/country.dto';

@Injectable()
export class CountriesService {
  private LOG_CONTEXT = 'CountriesService';

  constructor(
    @InjectRepository(Countries)
    private readonly countryRepository: Repository<Countries>,
  ) {}

  async getListCountries(filter: BaseQueryFilterDto) {
    try {
      const search = filter.search || '';
      const curPage = filter.page || 1;
      const perPage = filter.limit || 10;
      let skip = (curPage - 1) * perPage;
      skip = skip < 0 ? 0 : skip; //prevent negative on skip()

      const result = await this.countryRepository
        .createQueryBuilder('countries')
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

  async addCountry(data: CountriesDto) {
    const country = new Countries();
    country.name = data.name;
    return await this.countryRepository.save(country);
  }

  async updateCountry(id: string, data: CountriesDto) {
    const country = new Countries();
    country.id = id;
    country.name = data.name;
    return await this.countryRepository.save(country);
  }

  async deleteCountry(id: string) {
    return await this.countryRepository.delete(id);
  }
}
