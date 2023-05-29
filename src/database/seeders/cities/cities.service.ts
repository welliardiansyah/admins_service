import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Cities } from 'src/database/entities/cities.entity';
import { ICities } from 'src/database/interfaces/cities.interface';
import { Repository } from 'typeorm';
import { cities } from './cities.data';

@Injectable()
export class CitiesSeederService {
  constructor(
    @InjectRepository(Cities)
    private readonly cityRepository: Repository<Cities>,
  ) {}
  create(): Array<Promise<Cities>> {
    return cities.map(async (city: ICities) => {
      return await this.cityRepository
        .findOne({ where: { id: city.id } })
        .then(async (findOne) => {
          if (findOne) {
            return Promise.resolve(null);
          }
          const create_city = this.cityRepository.create(city);
          return await this.cityRepository.save(create_city);
        })
        .catch((error) => Promise.reject(error));
    });
  }
}
