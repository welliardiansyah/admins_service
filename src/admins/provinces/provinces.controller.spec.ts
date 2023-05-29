import { Test, TestingModule } from '@nestjs/testing';
import { MessageService } from 'src/message/message.service';
import { ResponseService } from 'src/response/response.service';
import { ProvincesController } from './provinces.controller';
import { ProvincesService } from './provinces.service';

describe('ProvincesController', () => {
  let controller: ProvincesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProvincesController],
      providers: [
        {
          provide: ProvincesService,
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

    controller = module.get<ProvincesController>(ProvincesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
