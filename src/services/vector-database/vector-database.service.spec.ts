import { Test, TestingModule } from '@nestjs/testing';
import { VectorDatabaseService } from './vector-database.service';

describe('VectorDatabaseService', () => {
  let service: VectorDatabaseService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [VectorDatabaseService],
    }).compile();

    service = module.get<VectorDatabaseService>(VectorDatabaseService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
