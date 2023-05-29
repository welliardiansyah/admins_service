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
import { ResponseStatusCode } from 'src/response/response.decorator';
import { ResponseService } from 'src/response/response.service';
import { ProvincesService } from './provinces.service';
import { ProvinceDto, ProvinceQueryFilterDto } from './types/province.dto';
import { RMessage } from 'src/response/response.interface';

@Controller('api/v1/admins/provinces')
export class ProvincesController {
  constructor(
    private readonly provinceService: ProvincesService,
    private readonly responseService: ResponseService,
    private readonly messageService: MessageService,
  ) {}

  @Get('')
  @ResponseStatusCode()
  async getListProvinces(@Query() query: ProvinceQueryFilterDto) {
    try {
      const result = await this.provinceService
        .getListProvinces(query)
        .catch((e) => {
          throw e;
        });

      return this.responseService.success(
        true,
        `Success get all province`,
        result,
      );
    } catch (e) {
      throw e;
    }
  }

  @Post()
  @ResponseStatusCode()
  async addCountry(@Body() data: ProvinceDto) {
    const result = await this.provinceService.addProvinces(data);
    if (!result) {
      const errors: RMessage = {
        value: data.name,
        property: 'provinces',
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
  async updateCountry(@Param() params, @Body() data: ProvinceDto) {
    const result = await this.provinceService.updateProvince(params.id, data);
    if (!result) {
      const errors: RMessage = {
        value: data.name,
        property: 'provinces',
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
    const result = await this.provinceService.deleteProvince(params.id);
    if (!result) {
      const errors: RMessage = {
        value: params.id,
        property: 'provinces',
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
