import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { CitiesSeederService } from './cities/cities.service';
import { CountriesSeederService } from './countries/countries.service';
import { PostalCodesSeederService } from './postal_codes/postal_codes.service';
import { ProvincesSeederService } from './provinces/provinces.service';

@Injectable()
export class Seeder implements OnApplicationBootstrap {
  constructor(
    private readonly logger: Logger,
    private readonly countrySeederService: CountriesSeederService,
    private readonly provincesSeederService: ProvincesSeederService,
    private readonly citiesSeederService: CitiesSeederService,
    private readonly postalCodesSeederService: PostalCodesSeederService,
  ) {}
  onApplicationBootstrap() {
    this.seed();
  }
  async seed() {
    await this.countries()
      .then((completed) => {
        this.logger.debug('Successfuly completed seeding Countries...');
        Promise.resolve(completed);
      })
      .catch((error) => {
        this.logger.error('Failed seeding Countries...');
        Promise.reject(error);
      });
    await this.provinces()
      .then((completed) => {
        this.logger.debug('Successfuly completed seeding Provinces...');
        Promise.resolve(completed);
      })
      .catch((error) => {
        this.logger.error('Failed seeding Provinces...');
        Promise.reject(error);
      });
    await this.cities()
      .then((completed) => {
        this.logger.debug('Successfuly completed seeding Cities...');
        Promise.resolve(completed);
      })
      .catch((error) => {
        this.logger.error('Failed seeding Cities...');
        Promise.reject(error);
      });
    await this.postal_codes()
      .then((completed) => {
        this.logger.debug('Successfuly completed seeding Postal Codes...');
        Promise.resolve(completed);
      })
      .catch((error) => {
        this.logger.error('Failed seeding Postal Codes...');
        Promise.reject(error);
      });
  }
  async countries() {
    return Promise.all(this.countrySeederService.create())
      .then((createdCountries) => {
        this.logger.debug(
          'No. of countries created : ' +
            createdCountries.filter(
              (nullValueOrCreatedCountries) => nullValueOrCreatedCountries,
            ).length,
        );
        return Promise.resolve(true);
      })
      .catch((error) => Promise.reject(error));
  }
  async provinces() {
    return Promise.all(this.provincesSeederService.create())
      .then((createdProvinces) => {
        this.logger.debug(
          'No. of provinces created : ' +
            createdProvinces.filter(
              (nullValueOrCreatedProvinces) => nullValueOrCreatedProvinces,
            ).length,
        );
        return Promise.resolve(true);
      })
      .catch((error) => Promise.reject(error));
  }
  async cities() {
    return Promise.all(this.citiesSeederService.create())
      .then((createCities) => {
        this.logger.debug(
          'No. of cities created : ' +
            createCities.filter(
              (nullValueOrCreatedCities) => nullValueOrCreatedCities,
            ).length,
        );
        return Promise.resolve(true);
      })
      .catch((error) => Promise.reject(error));
  }
  async postal_codes() {
    return Promise.all(await this.postalCodesSeederService.create())
      .then((createPostalCodes) => {
        this.logger.debug(
          'No. of postal codes created : ' +
            createPostalCodes.filter(
              (nullValueOrCreatedPostalCodes) => nullValueOrCreatedPostalCodes,
            ).length,
        );
        return Promise.resolve(true);
      })
      .catch((error) => Promise.reject(error));
  }
}
