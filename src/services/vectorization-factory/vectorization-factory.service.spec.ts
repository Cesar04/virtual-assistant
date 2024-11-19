import { Test, TestingModule } from '@nestjs/testing';
import { VectorizationFactoryService } from './vectorization-factory.service';

describe('VectorizationFactoryService', () => {
  let service: VectorizationFactoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [VectorizationFactoryService],
    }).compile();

    service = module.get<VectorizationFactoryService>(
      VectorizationFactoryService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
