import { Test, TestingModule } from '@nestjs/testing';
import { InputProcessorFactoryService } from './input-processor-factory.service';

describe('InputProcessorFactoryService', () => {
  let service: InputProcessorFactoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [InputProcessorFactoryService],
    }).compile();

    service = module.get<InputProcessorFactoryService>(
      InputProcessorFactoryService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
