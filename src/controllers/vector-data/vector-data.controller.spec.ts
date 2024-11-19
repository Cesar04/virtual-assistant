import { Test, TestingModule } from '@nestjs/testing';
import { VectorDataController } from './vector-data.controller';

describe('VectorDataController', () => {
  let controller: VectorDataController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VectorDataController],
    }).compile();

    controller = module.get<VectorDataController>(VectorDataController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
