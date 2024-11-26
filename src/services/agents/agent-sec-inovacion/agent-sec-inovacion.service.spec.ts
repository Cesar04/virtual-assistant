import { Test, TestingModule } from '@nestjs/testing';
import { AgentSecInovacionService } from './agent-sec-inovacion.service';

describe('AgentSecInovacionService', () => {
  let service: AgentSecInovacionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AgentSecInovacionService],
    }).compile();

    service = module.get<AgentSecInovacionService>(AgentSecInovacionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
