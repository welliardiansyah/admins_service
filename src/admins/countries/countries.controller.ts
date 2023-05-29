import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { MessageService } from 'src/message/message.service';
import { ResponseService } from 'src/response/response.service';
import { CountriesService } from './countries.service';
import { ResponseStatusCode } from 'src/response/response.decorator';
import { CountriesDto } from './types/country.dto';
import { RMessage } from 'src/response/response.interface';
import { BaseQueryFilterDto } from 'src/admins/validation/admins-users.dto';

@Controller('api/v1/admins/countries')
export class CountriesController {
  constructor(
    private readonly countriesService: CountriesService,
    private readonly responseService: ResponseService,
    private readonly messageService: MessageService,
  ) {}

  @Get()
  @ResponseStatusCode()
  async getListCountries(@Query() query: BaseQueryFilterDto) {
    try {
      const result = await this.countriesService
        .getListCountries(query)
        .catch((e) => {
          throw e;
        });

      return this.responseService.success(
        true,
        `Success get all countries`,
        result,
      );
    } catch (e) {
      throw e;
    }
  }

  @Post()
  @ResponseStatusCode()
  async addCountry(@Body() data: CountriesDto) {
    const result = await this.countriesService.addCountry(data);
    if (!result) {
      const errors: RMessage = {
        value: data.name,
        property: 'countries',
        constraint: [this.messageService.get('admins.general.nameExist')],
      };
      throw new BadRequestException(
        this.responseService.error(
          HttpStatus.BAD_REQUEST,
          errors,
          'Bad Request',
        ),
      );
    }
    return this.responseService.success(
      true,
      this.messageService.get('admins.general.success'),
      result,
    );
  }

  @Put(':id')
  @ResponseStatusCode()
  async updateCountry(@Param() params, @Body() data: CountriesDto) {
    const result = await this.countriesService.updateCountry(params.id, data);
    if (!result) {
      const errors: RMessage = {
        value: data.name,
        property: 'countries',
        constraint: [this.messageService.get('admins.general.nameExist')],
      };
      throw new BadRequestException(
        this.responseService.error(
          HttpStatus.BAD_REQUEST,
          errors,
          'Bad Request',
        ),
      );
    }
    return this.responseService.success(
      true,
      this.messageService.get('admins.general.success'),
      result,
    );
  }

  @Delete(':id')
  @ResponseStatusCode()
  async deleteCountry(@Param() params) {
    const result = await this.countriesService.deleteCountry(params.id);
    if (!result) {
      const errors: RMessage = {
        value: params.id,
        property: 'countries',
        constraint: [this.messageService.get('admins.general.nameExist')],
      };
      throw new BadRequestException(
        this.responseService.error(
          HttpStatus.BAD_REQUEST,
          errors,
          'Bad Request',
        ),
      );
    }
    return this.responseService.success(
      true,
      this.messageService.get('admins.general.success'),
      { id: params.id },
    );
  }
}
