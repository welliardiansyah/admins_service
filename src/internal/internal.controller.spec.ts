import { Test, TestingModule } from '@nestjs/testing';
import { InternalController } from './internal.controller';
import { InternalService } from './internal.service';

describe('InternalController', () => {
  let controller: InternalController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InternalController],
      providers: [
        {
          provide: InternalService,
          useValue: {},
        },
      ],
    }).compile();

    controller = module.get<InternalController>(InternalController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
