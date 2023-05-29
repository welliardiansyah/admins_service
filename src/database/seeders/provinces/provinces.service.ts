import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Provinces } from 'src/database/entities/provinces.entity';
import { IProvinces } from 'src/database/interfaces/provinces.interface';
import { Repository } from 'typeorm';
import { provinces } from './provinces.data';

@Injectable()
export class ProvincesSeederService {
  constructor(
    @InjectRepository(Provinces)
    private readonly provinceRepository: Repository<Provinces>,
  ) {}
  create(): Array<Promise<Provinces>> {
    return provinces.map(async (province: IProvinces) => {
      return await this.provinceRepository
        .findOne({ where: { id: province.id } })
        .then(async (findOne) => {
          if (findOne) {
            return Promise.resolve(null);
          }
          const create_province = this.provinceRepository.create(province);
          return await this.provinceRepository.save(create_province);
        })
        .catch((error) => Promise.reject(error));
    });
  }
}
