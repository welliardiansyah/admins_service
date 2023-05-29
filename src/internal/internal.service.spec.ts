import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { PostalCodes } from 'src/database/entities/postal_codes.entity';
import { InternalService } from './internal.service';

describe('InternalService', () => {
  let service: InternalService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InternalService,
        {
          provide: getRepositoryToken(PostalCodes),
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<InternalService>(InternalService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
