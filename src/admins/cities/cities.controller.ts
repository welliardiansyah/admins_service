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
import { CitiesService } from './cities.service';
import { ResponseStatusCode } from 'src/response/response.decorator';
import { CitiesDto, CitiesQueryFilterDto } from './types/cities.dto';
import { RMessage } from 'src/response/response.interface';

@Controller('api/v1/admins/cities')
export class CitiesController {
  constructor(
    private readonly citiesService: CitiesService,
    private readonly responseService: ResponseService,
    private readonly messageService: MessageService,
  ) {}

  @Get()
  @ResponseStatusCode()
  async getListCities(@Query() query: CitiesQueryFilterDto) {
    try {
      const result = await this.citiesService
        .getListCities(query)
        .catch((e) => {
          throw e;
        });

      return this.responseService.success(
        true,
        `Success get all cities`,
        result,
      );
    } catch (e) {
      throw e;
    }
  }

  @Post()
  @ResponseStatusCode()
  async addCities(@Body() data: CitiesDto) {
    const result = await this.citiesService.addCities(data);
    if (!result) {
      const errors: RMessage = {
        value: data.name,
        property: 'cities',
        constraint: [this.messageService.get('cities.general.data_not_found')],
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
      this.messageService.get('cities.general.success'),
      result,
    );
  }

  @Put(':id')
  @ResponseStatusCode()
  async updateCities(@Param() params, @Body() data: CitiesDto) {
    const result = await this.citiesService.updateCities(params.id, data);
    if (!result) {
      const errors: RMessage = {
        value: data.name,
        property: 'cities',
        constraint: [this.messageService.get('cities.general.data_not_found')],
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
      this.messageService.get('cities.general.success'),
      result,
    );
  }

  @Delete(':id')
  @ResponseStatusCode()
  async deleteCities(@Param() params) {
    const result = await this.citiesService.deleteCities(params.id);
    if (!result) {
      const errors: RMessage = {
        value: params.id,
        property: 'cities',
        constraint: [this.messageService.get('cities.general.cities')],
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
      this.messageService.get('cities.general.success'),
      { id: params.id },
    );
  }
}
