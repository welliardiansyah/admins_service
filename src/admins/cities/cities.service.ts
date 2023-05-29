import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Cities } from 'src/database/entities/cities.entity';
import { IListResponse } from 'src/response/response.interface';
import { Any, Repository } from 'typeorm';
import { CitiesDto, CitiesQueryFilterDto } from './types/cities.dto';

@Injectable()
export class CitiesService {
  private LOG_CONTEXT = 'CitiesService';

  constructor(
    @InjectRepository(Cities)
    private readonly citiesRepository: Repository<Cities>,
  ) {}

  async findOne(id: string) {
    return this.citiesRepository.findOne({
      relations: ['province', 'province.country'],
      where: { id },
    });
  }

  async findCitiesBulk(citi_ids: string[]) {
    return this.citiesRepository.find({ where: { id: Any(citi_ids) } });
  }

  async getListCities(filter: CitiesQueryFilterDto) {
    try {
      const search = filter.search || '';
      const curPage = filter.page || 1;
      const perPage = filter.limit || 10;
      let skip = (curPage - 1) * perPage;
      skip = skip < 0 ? 0 : skip; //prevent negative on skip()

      const result = await this.citiesRepository
        .createQueryBuilder('provinces')
        .where(`${search ? `name LIKE :search` : ''}`, {
          search: `%${search}%`,
        })
        .andWhere(`province_id = :province_id`, {
          province_id: filter.province_id,
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

  async addCities(data: CitiesDto) {
    const city = new Cities();
    city.province_id = data.provinceId;
    city.name = data.name;
    return await this.citiesRepository.save(city);
  }

  async updateCities(id: string, data: CitiesDto) {
    const city = new Cities();
    city.id = id;
    city.province_id = data.provinceId;
    city.name = data.name;
    return await this.citiesRepository.save(city);
  }

  async deleteCities(id: string) {
    return await this.citiesRepository.delete(id);
  }

  async getAllCities() {
    try {
      const [result, total_item] = await this.citiesRepository
        .createQueryBuilder('cities')
        .getManyAndCount()
        .catch((e) => {
          throw e;
        });

      const listItems = {
        total_item: total_item,
        items: result,
      };

      return listItems;
    } catch (e) {
      Logger.error(e.message, '', this.LOG_CONTEXT);
      throw e;
    }
  }
}
