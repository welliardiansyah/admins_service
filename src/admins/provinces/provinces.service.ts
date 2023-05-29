import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Provinces } from 'src/database/entities/provinces.entity';
import { IListResponse } from 'src/response/response.interface';
import { Repository } from 'typeorm';
import { ProvinceQueryFilterDto, ProvinceDto } from './types/province.dto';

@Injectable()
export class ProvincesService {
  private LOG_CONTEXT = 'ProvincesService';

  constructor(
    @InjectRepository(Provinces)
    private readonly provincesRepository: Repository<Provinces>,
  ) {}

  async getListProvinces(filter: ProvinceQueryFilterDto) {
    try {
      const search = filter.search || '';
      const curPage = filter.page || 1;
      const perPage = filter.limit || 10;
      let skip = (curPage - 1) * perPage;
      skip = skip < 0 ? 0 : skip; //prevent negative on skip()

      const result = await this.provincesRepository
        .createQueryBuilder('provinces')
        .where(`${search ? `name LIKE :search` : ''}`, {
          search: `%${search}%`,
        })
        .andWhere(`country_id = :country_id`, { country_id: filter.country_id })
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

  async addProvinces(data: ProvinceDto) {
    const province = new Provinces();
    province.country_id = data.countryId;
    province.name = data.name;
    return await this.provincesRepository.save(province);
  }

  async updateProvince(id: string, data: ProvinceDto) {
    const province = new Provinces();
    province.id = id;
    province.country_id = data.countryId;
    province.name = data.name;
    return await this.provincesRepository.save(province);
  }

  async deleteProvince(id: string) {
    return await this.provincesRepository.delete(id);
  }
}
