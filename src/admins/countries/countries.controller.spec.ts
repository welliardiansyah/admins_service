import { Test, TestingModule } from '@nestjs/testing';
import { MessageService } from 'src/message/message.service';
import { ResponseService } from 'src/response/response.service';
import { CountriesController } from './countries.controller';
import { CountriesService } from './countries.service';

describe('CountriesController', () => {
  let controller: CountriesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CountriesController],
      providers: [
        {
          provide: CountriesService,
          useValue: {},
        },
        {
          provide: ResponseService,
          useValue: {},
        },
        {
          provide: MessageService,
          useValue: {},
        },
      ],
    }).compile();

    controller = module.get<CountriesController>(CountriesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
