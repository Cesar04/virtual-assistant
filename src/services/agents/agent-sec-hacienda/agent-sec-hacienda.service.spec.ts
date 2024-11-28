import { Test, TestingModule } from '@nestjs/testing';
import { AgentSecHaciendaService } from './agent-sec-hacienda.service';

describe('AgentSecHaciendaService', () => {
  let service: AgentSecHaciendaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AgentSecHaciendaService],
    }).compile();

    service = module.get<AgentSecHaciendaService>(AgentSecHaciendaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
