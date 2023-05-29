import { HttpService } from '@nestjs/axios';
import {
  BadRequestException,
  Controller,
  Get,
  HttpStatus,
  Logger,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { CitiesService } from 'src/admins/cities/cities.service';
import { MessageService } from 'src/message/message.service';
import { ResponseStatusCode } from 'src/response/response.decorator';
import { RMessage } from 'src/response/response.interface';
import { ResponseService } from 'src/response/response.service';
import { GetCitiesBulkDto } from './dto/get-cities-bulk.dto';
// import { InternalCitiesService } from './cities.service';

@Controller('api/v1/admins/internal/cities')
export class InternalCitiesController {
  constructor(
    // private readonly internalCitiesService: InternalCitiesService,
    private readonly citisService: CitiesService,
    private readonly responseService: ResponseService,
    private readonly messageService: MessageService,
    private httpService: HttpService,
  ) {}

  logger: Logger = new Logger();

  @Post(':city_id')
  async getPostalCodeDetail(@Param('city_id') city_id: string) {
    console.log(city_id);
    const result = await this.citisService.findOne(city_id);
    if (!result) {
      const errors: RMessage = {
        value: city_id,
        property: 'city_id',
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

  @Get('bulks')
  @ResponseStatusCode()
  async getCitiesBulk(@Query() data: GetCitiesBulkDto) {
    try {
      const result = await this.citisService.findCitiesBulk(data.city_ids);
      return this.responseService.success(true, 'SUCCESS', result);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
